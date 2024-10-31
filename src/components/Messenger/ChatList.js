import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {getAllChats} from "../../backend/messenger";
import {backendError} from "../../backend/error";
import {Avatar} from "@material-ui/core";
import {connect} from "react-redux";
import {chooseChat, setChats} from "../../redux/actions/messenger";
import {useTranslation} from "next-i18next";
import moment from "moment";
import {currentUser} from "../../auth/Firebase";
import MessageStatus from "./MessageStatus";
import {Star} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  noChatsRoot: {
    width: '100%',
    height: '100%',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  noChats: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: "#071117",
    padding: "0.5% 2%",
    borderRadius: "7%/39%;"
  },
  chatContainer: {
    width: '100%',
    height: theme.spacing(8),
    color: "white",
    "&:hover": {
      backgroundColor: "#133648",
      cursor: 'pointer'
    }
  },
  newMessageChat: {
    backgroundColor: "#103750",
  },
  chosenChat: {
    backgroundColor: "#1a4c66",
  },
  chatPicture: {
    position: 'absolute',
    width: theme.spacing(7),
    height: theme.spacing(7),
    left: theme.spacing(1),
    color: "#092435",
    backgroundColor: "#134869"
  },
  chatName: {
    position: 'absolute',
    fontSize: theme.spacing(2.5),
    left: theme.spacing(10)
  },
  messageText: {
    position: 'relative',
    top: theme.spacing(3.5),
    fontSize: theme.spacing(2),
    left: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '80%',
    whiteSpace: 'nowrap',
  },
  messageTimeAndStatus: {
    display: 'flex',
    position: 'absolute',
    right: '1%',
  },
  messageTime: {
    marginTop: "2px",
    fontSize: theme.spacing(2),
  },
  messageStatus: {
    position: 'relative',
    right: '10%'
  },
  messageYou: {
    color: '#0b8dff'
  }
}))

const ChatList = ({chooseChat, chosenChat, chats, setChats}) => {
  const classes = useStyles()
  const { t } = useTranslation();

  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState([])

  useEffect(() => {
    getAllChats()
      .then(c => setChats(c))
      .catch(e => {
        if (e.response && e.response.status === 404) {
          setNotFound(true)
        } else {
          backendError(e)
          setLoadError(e)
        }
      })
  }, [])

  const chatLastMsg = (chat) => chat.lastMessage ? chat.lastMessage : {}

  const isMyMessage = (message) => message && message.userId === currentUser().uid

  function adaptedMessageTime(updatedAt) {

    if (moment(updatedAt).isSame(moment(), 'day')) {
      return moment(new Date(updatedAt)).format("HH:mm")
    }

    if (moment(updatedAt).isSame(moment().add(-1, 'days'), 'day')) {
      return t("MessengerPage.yesterday")
    }

    if (moment(updatedAt).isSame(moment(), 'week')) {
      return t(`DayOfWeek.${moment(new Date(updatedAt)).day()}`)
    }

    return moment(new Date(updatedAt)).format("D.MM.YYYY")
  }

  function isChatClickable(chat) {return !chosenChat || chosenChat.id !== chat.id}

  return (
    <div className={classes.root}>
      {notFound && chats.length === 0 && <div className={classes.noChatsRoot}><div className={classes.noChats}>{t("No chats yet")}</div></div>}
      {chats.map(chat => (
        <div key={chat.id} className={`${classes.chatContainer} ${!isMyMessage(chatLastMsg(chat)) && chatLastMsg(chat).status === 'sent' ? classes.newMessageChat : ''}
         ${chosenChat && chosenChat.id === chat.id ? classes.chosenChat : ""}`} onClick={() => isChatClickable(chat) && chooseChat(chat)}>
          <Avatar className={classes.chatPicture} src={chat.picture}>{chat.name.substring(0, 1)}</Avatar>
          <div className={classes.chatName}>{chat.name} {chat.name === "support" && <Star/>}</div>
          {
            chat.lastMessage &&
            <div className={classes.messageTimeAndStatus}>
              <div className={classes.messageStatus}>
                <MessageStatus message={chat.lastMessage}/>
              </div>
              <div className={classes.messageTime}>
                {adaptedMessageTime(chat.lastMessage.updatedAt)}
              </div>
            </div>
          }
          {
            chat.lastMessage &&
            <div className={classes.messageText}>
              {chatLastMsg(chat).userId === currentUser().uid && <span className={classes.messageYou}>You: </span>}
              {chatLastMsg(chat).text}
            </div>
          }
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = state => {
  const { messenger } = state
  return {chosenChat: messenger.chosenChat, chats: messenger.chats};
};

export default connect(mapStateToProps, {chooseChat, setChats}) (ChatList)