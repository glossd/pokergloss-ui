import AutoAwayNotification from "../UI/AutoAwayNotification";
import React, {useEffect} from "react";
import {Avatar} from "@material-ui/core";
import {connect} from "react-redux";
import {deleteNewMessage} from "../../redux/actions/news";
import {makeStyles} from "@material-ui/core/styles";
import useSound from "use-sound";
import {useRouter} from "next/router";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    backgroundColor: "#1a6491",
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: "#2e8db8",
      cursor: 'pointer',
    }
  },
  avatar: {
    width: "50px",
    height: "50px",
    margin: "10px"
  },
  nameAndText: {
    display: "flex",
    flexDirection: "column",
    marginTop: '10px',
    color: 'white'
},
  name: {
    fontWeight: 'bold',
  },
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '300px',
    minWidth: "150px",
    whiteSpace: 'nowrap',
  }
}));

const NewMessageNotification = ({newMessage, deleteNewMessage}) => {
  const classes = useStyles()
  const router = useRouter();

  const [playNewMessage, soundData] = useSound("https://storage.googleapis.com/pokerblow/sounds/notification.mp3", { volume: 1});

  useEffect(() => {
    return () => {
      soundData.stop()
    }
  }, [])

  useEffect(() => {
    if (newMessage) {
      playNewMessage()
    }
  }, [newMessage])

  function openMessenger() {
    router.push("/messenger")
    deleteNewMessage()
  }

  const safeMsg = newMessage ? newMessage : {}
  let safeFrom = newMessage ? newMessage.from : {};
  return (
    <AutoAwayNotification open={!!newMessage} onClose={deleteNewMessage} onClick={openMessenger}>
      <div className={classes.root}>
        <Avatar className={classes.avatar} src={safeFrom.picture}/>
        <div className={classes.nameAndText}>
          <div className={classes.name}>{safeFrom.username}</div>
          <div className={classes.text}>{safeMsg.text}</div>
        </div>
      </div>
    </AutoAwayNotification>
  )
}

const mapStateToProps = state => {
  const { news } = state
  return { newMessage: news.newMessage};
};


export default connect(mapStateToProps, {deleteNewMessage})(NewMessageNotification)