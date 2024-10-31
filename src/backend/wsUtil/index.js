import {connect} from "react-redux";
import React, {useEffect} from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import {getCurrentUserToken} from "../../auth/Firebase";
import {newTableEvent} from "../../redux/actions";

const NewsGiver = ({newTableEvent, isAuthenticated}) => {
  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    async function getUrl() {
      const token = await getCurrentUserToken()
      return `${wsHost()}/api/ws/news?token=${token}`;
    }
    const ws = new ReconnectingWebSocket(getUrl)
    ws.onerror = evt => console.error("News wsUtil error: ", evt)
    ws.onmessage = msg => {
      for (let event of extractEvents(msg)) {
        newTableEvent(event)
      }
    }
    return () => {
      ws.close()
    }
  }, [isAuthenticated])
  return <div/>
}

export function extractEvents(wsMsg) {
  let msgs = wsMsg.data.split('\n')
  return msgs.flatMap(msg => JSON.parse(msg))
}

export function wsHost() {
  let baseHost = "wss://api.pokergloss.com"
  if (process.env.NEXT_PUBLIC_USE_PROXY) {
    baseHost = "ws://localhost:8080"
  }
  if (process.env.NEXT_PUBLIC_DEV) {
    baseHost = "wss://uat.pokergloss.com"
  }
  return baseHost
}


const mapStateToProps = state => {
  const {auth} = state
  return {
    isAuthenticated: auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, {newTableEvent})(NewsGiver)