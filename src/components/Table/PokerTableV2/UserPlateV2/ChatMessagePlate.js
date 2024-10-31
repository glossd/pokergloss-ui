import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {subscribeBefore, unsubscribe} from "../../../../redux/redux-subscribe-action";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    bottom: '10%',
    left: '20%',
    width: "55%",
    height: "80%",
    background: "white",
    borderRadius: "50%",
    color: "#000000",
    fontWeight: "bold",
    zIndex: 3,
    fontSize: "1vw",
    textAlign: "center",
    padding: "0.3vw"
  },
  textContainer: {
    width: "100%",
    height: "100%",
    padding: "0.3vw",
    display: "inline-block",
    wordWrap: "break-word"
  },
  shiftForRight: {
    float: 'right',
    marginRight: "10%"
  },
  shiftForLeft: {
    marginLeft: "10%"
  },
  holdCard: {
    margin: '0 2px'
  }
}))

const ChatMessagePlate = React.memo(({playerUserId, position, isRight}) => {
  const classes = useStyles()
  const [text, setText] = useState(null)

  useEffect(() => {
    subscribeBefore(`chat-message-${position}`, (action) => {
      if (action.type === 'chatMessage') {
        if (playerUserId === action.payload.user.userId) {
          setText(action.payload.text)
          setTimeout(() => setText(""), 3000)
        }
      }
    })
    return () => {
      unsubscribe(`chat-message-${position}`)
    }
  }, [])

  if (!text) {
    return <div/>
  }

  return (
    <div className={classes.root}>
      <div className={`${classes.textContainer} ${isRight ? 'user-plate-message-right' : 'user-plate-message-left'}`}>
        {text.length < 18 ? text : text.substring(0, 18) + "*"}
      </div>
    </div>
  )
})

export default ChatMessagePlate
