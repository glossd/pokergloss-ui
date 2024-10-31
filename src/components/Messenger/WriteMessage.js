import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import IconButton from "@material-ui/core/IconButton";
import {Send} from "@material-ui/icons";
import {postU2UChat, sendChatMessage} from "../../backend/messenger";
import {backendError} from "../../backend/error";
import {errorMessage} from "../../backend";
import {connect} from "react-redux";
import {addChat, addMessage, chooseChat, removeChat, setText} from "../../redux/actions/messenger";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    position: "absolute",
    color: "white",
    left: '1%',
    width: '99%',
    backgroundColor: "#092435",
    border: 'none',
    outline: 'none',
    maxHeight: '100%'
  },
  sendButton: {
    position: 'absolute',
    right: 0,
    color: "#11adc7"
  }
}))

const WriteMessage = ({userId, chosenChat, addChat, removeChat, chooseChat, addMessage, text, setText}) => {
  const classes = useStyles()
  const { t } = useTranslation();

  const [sendError, setSendError] = useState()
  const [isMessageSending, setIsMessageSending] = useState(false)

  function createChatThenSend(userId) {
    postU2UChat(userId)
      .then(c => {
        addChat(c)
        sendChatMessage(c.id, text)
          .then(msg => {
            addMessage(msg)
            setText("")
            chooseChat(c)
          })
          .catch(e => {
            backendError(e)
            setSendError(errorMessage(e))
            chooseChat(c)
          })

      })
      .catch(e => {
        backendError(e)
        setSendError(errorMessage(e))
      })
  }

  const sendMessage = () => {
    if (!text.trim().length) {
      return
    }
    setIsMessageSending(true)
    if (userId) {
      createChatThenSend(userId);
    }
    if (chosenChat) {
      if (chosenChat.isPhantom && chosenChat.lastMessage) {
        removeChat(chosenChat.id)
        createChatThenSend(chosenChat.lastMessage.userId)
      } else {
        sendChatMessage(chosenChat.id, text)
          .then(msg => {
            setText("")
            addMessage(msg)
            setIsMessageSending(false)
          })
          .catch(e => {
            backendError(e)
            setSendError(errorMessage(e))
            setIsMessageSending(false)
          });
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMessageSending) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={classes.root}>
      <textarea
        id={"messenger-write-message"}
        className={classes.input}
        name={""}
        placeholder={t("MessengerPage.Write a message")}
        value={text}
        onKeyPress={handleKeyPress}
        onChange={e => setText(e.target.value)}
      />
      {
        text &&
        <IconButton className={classes.sendButton} onClick={sendMessage} disabled={isMessageSending}>
          <Send/>
        </IconButton>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const { messenger } = state
  return {text: messenger.text};
};

export default connect(mapStateToProps, {setText, addChat, removeChat, chooseChat, addMessage}) (WriteMessage)