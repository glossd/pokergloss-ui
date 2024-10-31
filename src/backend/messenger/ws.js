import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {newEvent} from "../../redux/actions";
import {getCurrentUserToken} from "../../auth/Firebase";
import ReconnectingWebSocket from "reconnecting-websocket";
import {extractEvents, wsHost} from "../wsUtil";

const MessengerWS = ({newEvent, isAuthenticated, text, chosenChat}) => {
  const [hookWS, setHookWS] = useState()
  const [isAllowSend, setAllowSend] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    async function getUrl() {
      const token = await getCurrentUserToken()
      return `${wsHost()}/api/messenger/ws/events?token=${token}`;
    }
    const ws = new ReconnectingWebSocket(getUrl)
    setHookWS(ws)
    ws.onerror = evt => console.error("Messenger ws error: ", evt)
    ws.onmessage = msg => {
      for (let event of extractEvents(msg)) {
        newEvent(event)
      }
    }
    return () => {
      ws.close()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (hookWS && chosenChat && text && isAllowSend) {
      setAllowSend(false)
      hookWS.send(JSON.stringify({type: "typing", payload: {text: text, chatId: chosenChat.id}}))
      setTimeout(() => setAllowSend(true), 200)
    }
  }, [text, chosenChat])

  return <div/>
}


const mapStateToProps = state => {
  const {auth, messenger} = state
  return {
    isAuthenticated: auth.isAuthenticated, text: messenger.text, chosenChat: messenger.chosenChat
  };
};

export default  connect(mapStateToProps, {newEvent})(MessengerWS)
