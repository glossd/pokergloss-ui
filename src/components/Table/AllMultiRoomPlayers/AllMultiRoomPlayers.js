import React, {useState} from "react";

import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import DefaultTableCell from "../../UI/DefaultTable/DefaultTableCell";
import {nameWithPicture} from "../../util/defaultTable";
import {useTranslation} from "next-i18next";
import DefaultTableRow from "../../UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../../UI/DefaultTable/DefaultTable";

const useStyles = makeStyles(() => ({
  multiPlayersButton: {
    background: '#346d80',
    borderRadius: '30%',
    border: 'solid white 1px',
    padding: '5px',
    '&:hover': {
      background: '#4d84a5',
    }
  },
  multiPlayersIcon: {
    color: "#eae6e6",
  },
  avatar: {
    height: '2vw',
    width: '2vw',
  },
  head: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '3.5rem',
  },
}));

const AllMultiRoomPlayers = ({allMultiPlayers, myPlace, prizes}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function prizeForTable(place, prizes) {
    for (let prize of prizes) {
      if (place === prize.place) {
        return prize.prize
      }
    }
  }

  let headers = [t("table.TournamentTopPlayers.Rank"), t("table.TournamentTopPlayers.Name"),
    t("table.TournamentTopPlayers.Chips"), t("table.TournamentTopPlayers.Prize")]

  return (
    <div>
      {
        <IconButton
          className={classes.multiPlayersButton}
          onClick={handleClickOpen}
          title={'show all players in multi room'}
        >
          <img className='pedestal-icon' src="https://storage.googleapis.com/pokerblow/poker-table/pedestal-icon.png"
               alt="pedestal-icon"/>
        </IconButton>
      }
      <DefaultDialog
        open={open}
        onClose={handleClose}
        title={t("table.TournamentTopPlayers.TopPlayersInTournament")}
        action={{text: "OK", onClick: handleClose}}
      >
        <DefaultTable
          headers={headers}
          body={
            allMultiPlayers &&
            allMultiPlayers.map((player, index) => {
              let place = ++index
              return (
                <DefaultTableRow key={player.username}
                                 className={`${place === myPlace && 'current-user-row'}`}
                                 odd='#0c0c0c' even='#000000'
                >
                  <DefaultTableCell>{place}</DefaultTableCell>
                  <DefaultTableCell
                    align={'left'}>{nameWithPicture(player.username, player.picture, classes.avatar)}</DefaultTableCell>
                  <DefaultTableCell>{player.stack}</DefaultTableCell>
                  <DefaultTableCell>{prizeForTable(place, prizes)}</DefaultTableCell>
                </DefaultTableRow>
              )
            })
          }
        />
      </DefaultDialog>
    </div>
  )
}

export default AllMultiRoomPlayers