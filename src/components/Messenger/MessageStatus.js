import {currentUser} from "../../auth/Firebase";
import {ModelMessageStatusEnum} from "@pokergloss/messenger-client-typescript";
import {Done, DoneAll, Markunread} from "@material-ui/icons";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    color: "#00ceff",
  },
  icon: {
    fontSize: '20px'
  }
}))

const MessageStatus = ({message}) => {
  const classes = useStyles()
  const isMyMessage = (message) => message.userId === currentUser().uid

  if (isMyMessage(message)) {
    return (
      <div className={classes.root}>
        {message.status === ModelMessageStatusEnum.Sent && <Done className={classes.icon}/>}
        {message.status === ModelMessageStatusEnum.Read && <DoneAll className={classes.icon}/>}
      </div>
    )
  } else {
    return (
      <div className={classes.root}>
        {message.status === ModelMessageStatusEnum.Sent && <Markunread className={classes.icon}/>}
      </div>
    )
  }
}

export default MessageStatus
