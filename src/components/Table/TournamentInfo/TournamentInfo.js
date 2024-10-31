import React, {useEffect, useState} from "react";

import {connect} from "react-redux";
import {subscribeBefore} from "../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum, ModelTableTypeEnum} from "@pokergloss/table-client-typescript";
import {getCurrentUser} from "../../../auth/Firebase";
import AllMultiRoomPlayers from "../AllMultiRoomPlayers/AllMultiRoomPlayers";
import Timer from "react-compound-timer";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// table is set only for sitngo
const TournamentInfo = ({table, tableType, tournamentAttrs, multiPlayers}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)');

  const [levelIncreaseAt, setLevelIncreaseAt] = useState(tournamentAttrs.levelIncreaseAt)
  const [firstPlaceStack, setFirstPlaceStack] = useState()
  const [firstPlaceName, setFirstPlaceName] = useState()
  const [myPlace, setMyPlace] = useState(null)
  const [allMultiPlayers, setAllMultiPlayers] = useState([])

  useEffect(() => {
    updateInfo()
  }, [multiPlayers])

  subscribeBefore("tournament-info", (action) => {
    if (action.type === EventsTableEventTypeEnum.Reset) {
      setLevelIncreaseAt(action.payload.table.tournamentAttrs.levelIncreaseAt)
      if (tableType === ModelTableTypeEnum.SitAndGo) {
        updateInfo()
      }
    }
  });

  function getAllPlayers() {
    switch (tableType) {
      case ModelTableTypeEnum.SitAndGo:
        return table.seats.filter(s => s.player).map(s => s.player)
      case "multi":
        let allPlayers = []
        for (let players of multiPlayers.values()) {
           allPlayers = allPlayers.concat(players)
        }
        return allPlayers
    }
  }

  function updateInfo() {
    const sortedPlayers = getAllPlayers().sort((a, b) => b.stack - a.stack)
    updateFirstPlace(sortedPlayers)
    updateMyPlace(sortedPlayers)
    setAllMultiPlayers(sortedPlayers)
  }

  function updateMyPlace(sortedPlayers) {
    getCurrentUser().then(user => {
      for (let i = 0; i < sortedPlayers.length; i++) {
        if (sortedPlayers[i].userId === user.uid) {
          setMyPlace(i + 1)
          return
        }
      }
    })
  }

  function updateFirstPlace(sortedPlayers) {
    let firstPlayer = sortedPlayers.length > 0 ? sortedPlayers[0] : {stack: 0, username: ""};
    setFirstPlaceStack(firstPlayer.stack)
    setFirstPlaceName(firstPlayer.username)
  }

  return (
    <div>
      <div className={'all-multi-room-players'}>
        {tableType === 'multi' && !isMobile && <AllMultiRoomPlayers allMultiPlayers={allMultiPlayers} myPlace={myPlace}
                                                        prizes={tournamentAttrs.prizes}/>}
      </div>
        <div className="tournament-info-root-table">
          {
            myPlace !== null && myPlace <= getAllPlayers().length &&
            <div>{t("table.tournamentInfo.MyPosition").format(myPlace, getAllPlayers().length)}</div>
          }
          <div className='next-level'>
            <div>{t("table.tournamentInfo.NextLevel").format(tournamentAttrs.nextSmallBlind + "/" + tournamentAttrs.nextSmallBlind*2)}&nbsp;</div>
            <Timer key={levelIncreaseAt}
                   initialTime={ levelIncreaseAt - Date.now()}
                   formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
                   direction="backward">
              <Timer.Minutes/> : <Timer.Seconds/>
            </Timer>
          </div>
          {
            firstPlaceName &&
            <div>{t("table.tournamentInfo.firstPlace.Start")}: <span className="first-place-name">{firstPlaceName}</span> {t("table.tournamentInfo.firstPlace.End").format(firstPlaceStack)}</div>
          }
        </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  let propsTable
  if (table.type === "sitAndGo") {
    propsTable = table
  }
  return {
    table: propsTable,
    tableType: table.type,
    tournamentAttrs: table.tournamentAttrs,
    multiPlayers: tableWS.multiPlayers
  };
};

export default connect(mapStateToProps)(TournamentInfo)