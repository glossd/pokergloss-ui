import React, {useEffect, useState} from 'react';

import {connect, useDispatch} from "react-redux"
import {fetchTables} from "../../../redux/actions/lobby";
import {useRouter} from "next/router";
import {makeStyles} from '@material-ui/core/styles';
import Loader from "../../UI/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import {FormGroup} from "@material-ui/core";
import DefaultCheckBox from "../../UI/DefaultCheckBox/DefaultCheckBox";
import CreateTable from "../CreateTable/CreateTable";
import {useTranslation} from "next-i18next";
import TablePreview from "../TablePreview/TablePreview";
import {toSeats} from "../../util/sitngoLobbyMappers";
import TournamentStartTime from "../../UI/TournamentStartTime/TournamentStartTime";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DefaultTableCell from "../../UI/DefaultTable/DefaultTableCell";
import DefaultTableRow from "../../UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../../UI/DefaultTable/DefaultTable";
import {backendError} from "../../../backend/error";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  tableContainer: {
    display: 'flex',
    maxWidth: '100vw',
    backgroundColor: '#070f14',
  },
  table: {
    width: '63%',
    margin: '0 1vw',
  }
}));

function TableListWithPreview({tables, loading, lobbyType, isEmailVerified}) {

  const {t} = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')

  const limit = 15

  const [hideEmpty, setHideEmpty] = useState(false);
  const [hideFull, setHideFull] = useState(false);

  const [selectedTable, setSelectedTable] = useState('')
  const [isUserSelectedTable, setIsUserSelectedTable] = useState(false)

  function showTablePreview(selectedTable) {
    setSelectedTable(selectedTable)
    setIsUserSelectedTable(true)
  }

  const handleChangeEmptyTables = (event) => {
    fetchTables(dispatch, lobbyType, true, 0, limit, event.target.checked, hideFull)
      .catch(backendError)
    setHideEmpty(event.target.checked);
  };
  const handleChangeFullTables = (event) => {
    fetchTables(dispatch, lobbyType, true, 0, limit, hideEmpty, event.target.checked)
      .catch(backendError)
    setHideFull(event.target.checked);
  };

  // no async function
  useEffect(() => {
    fetchTables(dispatch, lobbyType, true, 0, limit)
      .catch(backendError)
  }, []);

  useEffect(() => {
    if (tables.length !== 0 && isUserSelectedTable === false) {
      setSelectedTable(tables[0])
    }
  })

  if (loading && tables.length === 0) {
    return (
      <div className="lobby-loader">
        <Loader/>
      </div>
    )
  }

  const fetchMore = () => {
    if (tables.length > 0) {
      fetchTables(dispatch, lobbyType, false, tables.length, limit, hideEmpty, hideFull)
        .catch(backendError)
    }
  }

  const router = useRouter();

  function openTablePage(id) {
    switch (lobbyType) {
      case "sitngo":
        router.push('/lobby/sitngo/' + id)
        break
      case "multi":
        router.push('/lobby/multi/' + id)
        break
      case "live":
      default:
        router.push('/tables/' + id)
    }
  }

  const isMultiLobby = () => {
    return lobbyType === "multi"
  }

  function adaptMultiRoomName(name) {
    if (!name) {
      return name
    }
    if (name === "Daily Tournament") {
      return t("Daily Tournament")
    }
    if (name.startsWith("Freeroll")) {
      return t("Freeroll") + name.substring("Freeroll".length)
    }
    return name
  }

  const tableHeaders = () => {
    switch (lobbyType) {
      case "sitngo":
        return [t("lobby.Table Headers.Table"), t("lobby.Table Headers.Game"), t("lobby.Table Headers.Status"),
          t("lobby.Table Headers.Players"), t("lobby.Table Headers.Blinds"), t("lobby.Table Headers.Decision (sec)"),
          t("lobby.Table Headers.Buy-in"), t("lobby.Table Headers.Places paid")]
      case "multi":
        return [t("lobby.Table Headers.Name"), t("lobby.Table Headers.Game"), t("lobby.Table Headers.Start"),
          t("lobby.Table Headers.Players"), t("lobby.Table Headers.Prize Pool"), t("lobby.Table Headers.Starting Chips")]
      case "live":
      default:
        return [t("lobby.Table Headers.Table"), t("lobby.Table Headers.Game"), t("lobby.Table Headers.Players"),
          t("lobby.Table Headers.Stakes"), t("lobby.Table Headers.Decision (sec)"),
          t("lobby.Table Headers.Pot (avg)"), t("lobby.Table Headers.Stakes (avg)")]
    }
  }

  const roomRow = (room) => {
    if (!room) {
      return []
    }
    switch (lobbyType) {
      case "sitngo":
        let lTable = room.lobbyTable;
        return [lTable.name, `${room.bettingLimit} Hold'em`, room.status, room.entries.length + "/" + lTable.size,
          lTable.bigBlind / 2 + "/" + lTable.bigBlind, lTable.decisionTimeoutSec, room.buyIn, room.placesPaid]
      case "multi":
        return [adaptMultiRoomName(room.name), `${room.bettingLimit} Hold'em`, <TournamentStartTime startAt={room.startAt}/>, room.players.length,
          room.prizePerUser * room.players.length, room.startingChips]
      case "live":
      default:
        const table = room
        return [table.name, `${table.bettingLimit} Hold'em`, table.occupied + '/' + table.size, table.smallBlind + '/' + table.bigBlind,
          table.decisionTimeoutSec, table.avgPot, table.avgStake]
    }
  }

  const getFilterCheckboxes = () => {
    if (isMultiLobby()) {
      return []
    }

    const result = []
    const hideEmptyBox =
      <DefaultCheckBox
        key={"hideEmpty"}
        checked={hideEmpty}
        onChange={handleChangeEmptyTables}
        name={"emptyTables"}
        label={t("lobby.Hide Empty")}
      />;

    const hideFullBox =
      <DefaultCheckBox
        key={"hideFull"}
        checked={hideFull}
        onChange={handleChangeFullTables}
        name={"fullTables"}
        label={t("lobby.Hide Full")}
      />;

    result.push(hideEmptyBox)
    result.push(hideFullBox)

    return result
  }

  function getSeatsForPreview() {
    switch (lobbyType) {
      case "sitngo":
        if (selectedTable.entries) {
          return toSeats(selectedTable)
        } else {
          return null
        }
      case "live":
      default:
        return selectedTable.seats
    }
  }

  function getTableNameForPreview() {
    switch (lobbyType) {
      case "sitngo":
        if (selectedTable.entries) {
          return selectedTable.lobbyTable.name
        } else {
          return null
        }
      case "live":
      default:
        return selectedTable.name
    }
  }

  return (
    <InfiniteScroll
      dataLength={tables.length}
      next={fetchMore}
      hasMore={(tables.length === 0 && loading) || (tables.length % limit === 0)}
      endMessage={
        <div style={{textAlign: "center"}}>
          {tables.length === 0 && <b>Empty lobby</b>}
        </div>
      }
    >
      <div className='hide-create'>
        <FormGroup row>
          <div className='lobby-checkboxes'>
            {getFilterCheckboxes()}
          </div>
        </FormGroup>

        {isEmailVerified && !isMultiLobby() && <CreateTable lobbyType={lobbyType}/>}
      </div>

      <DefaultTable
        containerClassName={classes.tableContainer}
        tableClassName={isPortrait ? '' : classes.table}
        headers={tableHeaders()}
        body={
          tables.map(table => {
            const isSelected = table.id === selectedTable.id
            return (
              <DefaultTableRow
                isSelected={isSelected}
                key={table.id}
                onClick={() => isPortrait ? openTablePage(table.id) : showTablePreview(table)}
                onDoubleClick={() => openTablePage(table.id)}
              >
                {roomRow(table).map((v, idx) => (
                  <DefaultTableCell className={table.marketPrize ? (table.marketPrize.itemId === 'crown' ? "market-prize-crown" : "marker-prize-default") : ""} key={idx}>
                    {v}
                  </DefaultTableCell>))}
              </DefaultTableRow>)
          })
        }
      />

      {!isPortrait &&
      <div className={`${isMobile ? 'preview-position-mobile' : 'preview-position-desktop'} preview-position-common`}>
        {!isMultiLobby() && <TablePreview seats={getSeatsForPreview()}/>}
        <div className='selected-table-name'>
          {getTableNameForPreview()}
        </div>
        <div className='enter-the-room'>
          <DefaultButton onClick={() => openTablePage(selectedTable.id)}>{t("lobby.Open Room")}</DefaultButton>
        </div>
      </div>}

    </InfiniteScroll>
  );
}

function mapStateToProps(state) {
  return {
    isEmailVerified: state.auth.isEmailVerified,
    tables: state.lobby.tables,
    loading: state.lobby.loading,
  }
}

export default connect(mapStateToProps)(TableListWithPreview)