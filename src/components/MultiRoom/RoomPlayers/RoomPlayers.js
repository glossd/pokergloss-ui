import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import {avatarUrlOrDefault} from "../../../auth";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {getMultiRoom} from "../../../backend/table";
import {backendError} from "../../../backend/error";
import {updateMultiRoom} from "../../../redux/actions/multiRoom";

const desktopStyles = makeStyles(() => ({
  playersList: {
    height: '75vh',
    overflowY: 'auto',
    width: '33%',
    padding: '2vw'
  },
  avatar: {
    height: '2vw',
    width: '2vw',
    margin: '0 0.5vw',
    borderRadius: "50%"
  }
}))

const mobileStyles = makeStyles(() => ({
  playersList: {
    height: '100vh',
    overflowY: 'auto',
    width: '45%',
    padding: '2vw'
  },
  avatar: {
    height: '4vw',
    width: '4vw',
    margin: '0 1vw',
    borderRadius: "50%"
  }
}))

const portraitStyles = makeStyles(() => ({
  playersList: {
    height: '70vh',
    overflowY: 'auto',
    width: '45%',
    padding: '2vw'
  },
  avatar: {
    height: '4vw',
    width: '4vw',
    margin: '0 1vw',
    borderRadius: "50%"
  }
}))

const RoomPlayers = ({room, id, updateMultiRoom}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const {t} = useTranslation();
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (room.tables && room.tables.length > 0) {
        getMultiRoom(id)
          .then(room => {
            updateMultiRoom(room)
          })
          .catch(error => {
            backendError(error)
          })
      }
    }, 30000);
    return () => clearInterval(intervalId);
  }, [room.tables])

  function tablePlayers() {
    return room.tables
      .flatMap(table => table.seats)
      .map(seat => seat.player)
      .filter(player => player)
      .sort((a, b) => b.stack - a.stack)
  }

  function playerRow(player, index) {
    return (
      <div className='multi-table-player'>
        <div>{++index}</div>
        <img className={classes.avatar} src={avatarUrlOrDefault(player.picture)} alt="player-avatar"/>
        {player.username}
        <div className='multi-table-player-stack'>{player.stack}</div>
      </div>
    )
  }

  return (
    <>
      <div className={classes.playersList}>
        {room.players && room.players.length > 0 &&
        <div className='multi-table-players players-list-title'>
          <div>№</div>
          <div className='multi-table-player-indention'>{t("MultiPage.PlayersList.Name")}</div>
          {(room.tables && room.tables.length > 0) && <div className='multi-table-player-stack'>{t("MultiPage.PlayersList.Chips")}</div>}
        </div>}

        {(room.tables && room.tables.length > 0) ?
          tablePlayers().map((player, index) => {
            return (<div key={player.username}>{playerRow(player, index)}</div>)
          }) :
          room.players && room.players.map((player, index) => {
            return (<div key={player.username}>{playerRow(player, index)}</div>)
          })}
      </div>
    </>
  )
}

const mapStateToProps = state => {
  const {multiRoom} = state
  return {room: multiRoom.room}
}

export default connect(mapStateToProps, {updateMultiRoom})(RoomPlayers)

