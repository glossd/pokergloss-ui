import React, {useEffect} from "react";
import {getCurrentUser, getCurrentUserToken} from "../../auth/Firebase";
import ReconnectingWebSocket from 'reconnecting-websocket';
import {EventsTableEventTypeEnum, ModelTableTypeEnum} from "@pokergloss/table-client-typescript";
import {getMultiRoom, getSitngoRoom, getTable} from "../table";
import {connect} from "react-redux";
import {newEvent} from "../../redux/actions";
import {getPosition} from "../../components/Table/util";
import {closeWs, setAllMultiPlayers, setCurrentUserPosition, setWs, tableStatus} from "../../redux/actions/table";
import {toSeats} from "../../components/util/sitngoLobbyMappers";
import {useRouter} from "next/router";
import {extractEvents, wsHost} from "../wsUtil";
import {backendError} from "../error";
import {multiRoomStatus} from "../../redux/actions/multiRoom";
import {addEvents} from "./eventStore";

const EntityWS = ({id, type, isAuthenticated, newEvent, setCurrentUserPosition, setWs, closeWs, setAllMultiPlayers, multiRoomStatus, tableStatus}) => {
  const router = useRouter();

  useEffect(() => {
    console.info("EntityWS mount, id=" + id + " isAuth=" + isAuthenticated)

    async function connect(userId) {
      switch (type) {
        case "table":
          let table
          try {
            table = await getTable(id)
          } catch(e) {
            if (e.response) {
              tableStatus(e.response.status)
              if (e.response.status !== 404) {
                backendError(e)
              }
            }
            return
          }
          setCurrentUserPosition(getPosition(table, userId))
          newEvent({
            type: EventsTableEventTypeEnum.InitState,
            payload: {table: table}
          })
          if (table.type === ModelTableTypeEnum.Multi && table.tournamentAttrs && table.tournamentAttrs.lobbyId) {
            getMultiRoom(table.tournamentAttrs.lobbyId)
              .then((multiRoom) => {
                setAllMultiPlayers(multiRoom)
              })
              .catch(backendError)
          }
          break
        case "sitngoLobby":
          const sitNgoRoom = await getSitngoRoom(id)
            .catch(backendError)
          if (sitNgoRoom.tableId) {
            router.push("/tables/" + sitNgoRoom.tableId)
            return
          }
          let seats = toSeats(sitNgoRoom)
          seats.filter(s => s.player && s.player.userId === userId).forEach(s => setCurrentUserPosition(s.position))
          let adaptedEvent = {
            type: "sitngoInitState",
            payload: {
              table: Object.assign(sitNgoRoom.lobbyTable, {id,seats, type: "sitngoLobby"}),
              room: sitNgoRoom
            }
          };
          newEvent(adaptedEvent)
          break
        case "multiLobby":
          const multiRoom = await getMultiRoom(id)
            .catch(error => {
              if (error.response) {
                multiRoomStatus(error.response.status)
              }
              backendError(error)
            })
          newEvent({type: "multiInit", payload: multiRoom})
          break
      }

      connectWs()
    }

    function connectWs() {
      async function getUrl() {
        let url = `${wsHost()}/api/table-stream/tables/${id}`
        const token = await getCurrentUserToken()
        if (token) {
          url += `?token=${token}`;
        }
        return url
      }
      const websocket = new ReconnectingWebSocket(getUrl)
      setWs(websocket)

      websocket.onopen = () => {
        console.info('opened entity ws', id)
      }

      websocket.onmessage = msg => {
        addEvents(extractEvents(msg), newEvent)
      }

      websocket.onerror = evt => console.error("Entity wsUtil error: ", evt)

      websocket.onclose = () => console.info('closed entity wsUtil')
    }

    getCurrentUser().then(user => {
      if (!user) {
        connect(null)
      } else {
        connect(user.uid)
      }
    })

    return () => {
      console.info("EntityWS unmount")
      closeWs()
    }
  }, [isAuthenticated, id])

  return <div/>
}


const mapStateToProps = state => {
  const { tableWS, auth, gameWs } = state
  return {
    table: tableWS.table,
    currentUserPosition: tableWS.currentUserPosition,
    isAuthenticated: auth.isAuthenticated,
    isEmailVerified: auth.isEmailVerified,
    ws: gameWs.ws
  };
};

export default connect(mapStateToProps, {newEvent, setCurrentUserPosition, setWs, closeWs, setAllMultiPlayers, multiRoomStatus, tableStatus})(EntityWS)
