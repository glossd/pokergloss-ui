import {connect} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import WriteMessage from "./WriteMessage";
import {getChatMessages, readChatMessages} from "../../backend/messenger";
import {backendError} from "../../backend/error";
import {currentUser} from "../../auth/Firebase";
import moment from "moment";
import ChatHeader from "./ChatHeader";
import {addMessages, setMessages, setMessagesToRead} from "../../redux/actions/messenger";
import {ModelMessageStatusEnum, WsstoreMessengerEventTypeEnum} from "@pokergloss/messenger-client-typescript";
import MessageStatus from "./MessageStatus";
import ChatTyping from "./ChatTyping";

import InfiniteScroll from "react-infinite-scroll-component";
import {subscribeAfter, unsubscribe} from "../../redux/redux-subscribe-action";
import Linkify from 'react-linkify';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  selectChatRoot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',

  },
  selectChat: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: "#092435",
    padding: "0.5% 1%",
    borderRadius: "5%/45%"
  },
  header: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: "6%",
    backgroundColor: "#092435",
    borderLeft: '1px solid black',
  },
  headerChatPicture: {
    marginLeft: "2%"
  },
  headerChatName: {
    marginLeft: "1%"
  },
  typing: {
    position: 'absolute',
    bottom: "6%",
    left: "1%",
    fontStyle: 'italic',
    fontSize: '0.9rem'
  },
  writeMessageRoot: {
    position: 'absolute',
    backgroundColor: "#092435",
    width: '100%',
    height: "6%",
    bottom: '0%',
    borderLeft: '1px solid black'
  },
  messagesBoxRoot: {
    position: 'absolute',
    width: '100%',
    top: "6%",
    height: "86%",
    overflow: 'auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column-reverse',
  },
  messageContainer: {
    width: "fit-content",
    padding: '5px 10px',
    margin: '5px',
    borderRadius: '10px',
    maxWidth: "80%"
  },
  message: {
    display: 'flex',
  },
  myMessage: {
    backgroundColor: "#1a6491",
    marginLeft: 'auto'
  },
  othersMessage: {
    backgroundColor: "#0f2d3e"
  },
  messageText: {
    color: 'white',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  messageTime: {
    color: "grey",
    marginLeft: '5px',
    marginTop: '5px',
    fontSize: "15px",
  },
  messageStatus: {
    marginLeft: "2px"
  },
  scrollBottom: {
    position: 'absolute',
    bottom:0
  },
  link: {
    color: '#5facff',
    '&:hover': {
      color: '#5facff',
    }
  }
}));

const Chat = ({chosenChat, chosenUser, messages, setMessages, addMessages, isLastMessages, setMessagesToRead}) => {
  const classes = useStyles()

  const [messagesError, setMessagesError] = useState()

  const messagesBottomRef = useRef(null)
  const [wasNewMessage, setWasNewMessage] = useState(false)
  const scrollToBottom = () => messagesBottomRef.current && messagesBottomRef.current.scrollIntoView({ behavior: "auto"})
  useEffect(() => {
    subscribeAfter("messenger-chat", action => {
      if (action.type === WsstoreMessengerEventTypeEnum.MessengerNewMessage) {
        setWasNewMessage(true)
        setTimeout(() => setWasNewMessage(false), 400)
      }
    })
    return () => {
      unsubscribe("messenger-chat")
    }
  },[])
  useEffect(() => {
    if (wasNewMessage) {
      scrollToBottom()
      if (messages && messages.length > 0) {
        let unreadIds = []
        if (messages[0].userId !== currentUser().uid) {
          for (let message of messages) {
            if (message.status === ModelMessageStatusEnum.Sent) {
              unreadIds.push(message.id)
            } else {
              break
            }
          }

          if (unreadIds.length > 0) {
            readChatMessages(messages[0].chatId, unreadIds)
              .then(r => setMessagesToRead(unreadIds))
              .catch(e => backendError(e))
          }
        }
      }
    }
  }, [wasNewMessage])


  function fetchMore() {
    if (!chosenChat || messages.length === 0) {
      return
    }
    if (messages.length % 20 === 0) {
      const lastMessage = messages[messages.length - 1]
      getChatMessages(chosenChat.id, 20, lastMessage.id)
        .then((r) => {
          addMessages(r.messages)
        }).catch(e => setMessagesError(e))
    }
  }


  useEffect(() => {
    if (chosenChat) {
      getChatMessages(chosenChat.id, 20)
        .then(r => {
          let msgs = r.messages ? r.messages :[];
          setMessages(msgs)
          if (msgs.length > 0) {
            const allUnread = msgs.filter(m => m.userId !== currentUser().uid && m.status === ModelMessageStatusEnum.Sent)
            if (allUnread && allUnread.length > 0) {
              const allUnreadIds = allUnread.map(m => m.id)
              readChatMessages(allUnread[0].chatId, allUnreadIds)
                .then(() => setMessagesToRead(allUnreadIds))
                .catch(e => backendError(e))
            }
          }
        })
        .catch(e => {
          backendError(e)
          setMessagesError(e)
        })
    } else {
      setMessages([])
    }
  }, [chosenChat])

  if (!chosenChat && !chosenUser) {
    return (
      <div className={classes.selectChatRoot}>
        <div className={classes.selectChat}>
          Select a chat to send a message
        </div>
      </div>
    )
  }

  if (chosenUser) {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <ChatHeader name={chosenUser.username} picture={chosenUser.picture}/>
        </div>
        <div className={classes.writeMessageRoot}>
          <WriteMessage userId={chosenUser.userId}/>
        </div>
      </div>
    )
  }

  const isMyMessage = (message) => message.userId === currentUser().uid

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <ChatHeader name={chosenChat.name} picture={chosenChat.picture}/>
      </div>
      <div id="messengerChatBox" className={classes.messagesBoxRoot}>
        <div ref={messagesBottomRef} className={classes.scrollBottom}/>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMore}
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={!isLastMessages}
          loader={<p>Loading...</p>}
          scrollableTarget="messengerChatBox"
        >
          {
            messages.map((m) => (
              <div key={m.id} className={`${classes.messageContainer} ${isMyMessage(m) ? classes.myMessage : classes.othersMessage}`}>
                <div className={classes.message}>
                  <div className={classes.messageText}>
                    <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a target="blank" href={decoratedHref} key={key} className={classes.link}>{decoratedText}</a>
                    )}>{m.text}</Linkify>
                  </div>
                  <div className={classes.messageTime}>
                    {moment(new Date(m.updatedAt)).format("HH:mm")}
                  </div>
                  {
                    isMyMessage(m) &&
                    <div className={classes.messageStatus}>
                      <MessageStatus message={m}/>
                    </div>
                  }
                </div>
              </div>
            ))
          }
        </InfiniteScroll>
      </div>
      <div className={classes.typing}>
        <ChatTyping/>
      </div>
      <div className={classes.writeMessageRoot}>
        <WriteMessage chosenChat={chosenChat}/>
      </div>
    </div>
  )
}

// https://stackoverflow.com/a/65008608/10160865
function useOnScreen(ref) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  )

  const tryObserve = () => {
    if (ref.current) {
      observer.observe(ref.current)
    } else {
      setTimeout(tryObserve, 500)
    }
  }

  useEffect(() => {
    tryObserve()
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
  }, [])

  return isIntersecting
}

const mapStateToProps = state => {
  const { messenger } = state
  return {chosenChat: messenger.chosenChat, chosenUser: messenger.chosenUser, messages: messenger.messages, isLastMessages: messenger.isLastMessages};
};

export default connect(mapStateToProps, {setMessages, addMessages, setMessagesToRead})(Chat)