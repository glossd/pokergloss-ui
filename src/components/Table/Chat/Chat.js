import React, {useEffect, useRef, useState} from "react"

import {subscribeBefore} from "../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum, ModelPlayerShowDownActionEnum} from "@pokergloss/table-client-typescript";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {DefaultTab, DefaultTabs} from "../../UI/Tabs";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import {postMessage} from "../../../backend/chat";
import {Badge} from "@material-ui/core";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
    left: '1%',
    marginBottom: '40px'
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    color: 'white',
  },
  tabs: {
    zIndex: 1,
    position: 'absolute',
    top: '77%',
    left: '2%',
    minHeight: '1vw',
  },
  chatTab: {
    width: '10%',
    minHeight: '1vw',
    padding: 0,
  },
  playerMessage: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: '2%',
    width: '50%',
    height: '35px'
  }
}));

const StyledBadge = withStyles(() => ({
  badge: {
    top: '0.8vw',
    left: '1.9vw',
    padding: '0 0.3vw'
  },
}))(Badge);

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `chat-tab-${index}`,
    'aria-controls': `chat-tabpanel-${index}`,
  };
}

const Chat = ({tableId}) => {
  const classes = useStyles();
  const {t} = useTranslation();

  const [messages, setMessages] = useState([])
  const [playersMessages, setPlayersMessages] = useState([])
  const [playerMessage, setPlayerMessage] = useState('')
  const [tabIndex, setTabIndex] = useState(0);
  const [newChatMessagesCount, setNewChatMessagesCount] = useState(0);

  // https://stackoverflow.com/a/52266212/14441157
  const messagesEndRef = useRef(null)
  const scrollToBottomSmooth = () => {
    messagesEndRef.current.scrollIntoView({behavior: "smooth"})
  }
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({behavior: "auto"})
  }
  useEffect(scrollToBottomSmooth, [messages]); // todo merge useEffects
  useEffect(scrollToBottomSmooth, [playersMessages]);
  useEffect(scrollToBottom, [tabIndex]);
  useEffect(() => {
    return () => {
      setMessages([])
      setPlayersMessages([])
      setPlayerMessage('')
      setNewChatMessagesCount(0)
    }
  }, [])

  function translateHandRank(handRank) {
    return t(`table.HandName.${handRank}`)
  }

  const buildMessagesOfWinners = (winners) => {
    if (!winners) {
      return []
    }
    let resultMsgs = []
    for (let w of winners) {
      let msg = `${w.username} ${t("table.Chat.wins")} ${w.chips} ${t("table.Chat.chips")}`
      if (w.handRank) {
        msg += ` ${t("table.Chat.with")}: ${translateHandRank(w.handRank)}`
      }
      resultMsgs.push(msg)
    }
    return resultMsgs
  }

  const buildMessagesOfDealtToBoard = (newCards) => {
    newCards = newCards.join(' ')
    return `${t("table.Chat.DealtToBoard")}: [ ${newCards} ]`
  }

  const buildMessagesOfNewHand = () => {
    return `** ${t("table.Chat.NewHandStarted")} **`
  }

  const buildMessagesOfShowDownAction = (seats) => {
    let resultMsgs = []
    let players = seats.map(seat => seat.player)

    for (let player of players) {
      let username = player.username
      let showDownAction = player.showDownAction
      let msg = `${username}`

      switch (showDownAction) {
        case ModelPlayerShowDownActionEnum.Show: {
          let cards = player.cards.join(' ')
          msg += ` ${t("table.Chat.shows")} [ ${cards} ]`
          break
        }
        case ModelPlayerShowDownActionEnum.Muck: {
          msg += ` ${t("table.Chat.mucks")}`
          break
        }
      }

      resultMsgs.push(msg)
    }
    return resultMsgs
  }

  subscribeBefore("chat", (action) => {
    if (action.type === EventsTableEventTypeEnum.Winners) {
      setMessages(messages.concat(buildMessagesOfWinners(action.payload.table.winners)))
    }
    if (action.type === EventsTableEventTypeEnum.NewBettingRound) {
      setMessages(messages.concat(buildMessagesOfDealtToBoard(action.payload.newCards)))
    }
    if (action.type === EventsTableEventTypeEnum.Blinds) {
      setMessages(messages.concat(buildMessagesOfNewHand()))
    }
    if (action.type === EventsTableEventTypeEnum.ShowDown) {
      setMessages(messages.concat(buildMessagesOfShowDownAction(action.payload.table.seats)))
    }
    if (action.type === 'chatMessage') {
      setPlayersMessages(playersMessages.concat(buildPlayerMessage(action.payload)))
      if (tabIndex !== 1) {
        setNewChatMessagesCount(newChatMessagesCount + 1)
      }
    }
  });

  const changeTab = (event, index) => {
    setTabIndex(index);
    if (index === 1) {
      setNewChatMessagesCount(0)
    }
  };

  function onChangePlayerMessage(inputMessage) {
    setPlayerMessage(inputMessage)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendPlayerMessage()
    }
  }

  function sendPlayerMessage() {
    postMessage(tableId, playerMessage)
      .then(() => {
        setPlayerMessage('')
      })
      .catch(backendError)
  }

  function buildPlayerMessage(message) {
    return `${message.user.username}: ${message.text}`
  }

  return (
    <div className={`${classes.root} chat-root`}>
      <DefaultTabs
        className={classes.tabs}
        value={tabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={changeTab}
        aria-label="chat tabs"
      >
        <DefaultTab className={classes.chatTab} label={t("table.Chat.Dealer")} {...a11yProps(0)} />
        <DefaultTab className={classes.chatTab}
                    label={
                      <StyledBadge badgeContent={newChatMessagesCount} color="secondary">
                        {t("table.Chat.Chat")}
                      </StyledBadge>
                    }
                    {...a11yProps(1)}
        />
      </DefaultTabs>

      <TabPanel value={tabIndex} index={0}>
        <List className={`${classes.root}`}>
          {messages.map((msg, idx) => (
            <ListItem className={classes.listItem} key={idx} autoFocus={idx === messages.length - 1}>
              <ListItemText primary={msg}/>
            </ListItem>
          ))}
          <div ref={messagesEndRef}/>
        </List>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <List className={`${classes.root} chat-root`}>
          {playersMessages.map((msg, idx) => (
            <ListItem className={classes.listItem} key={idx} autoFocus={idx === messages.length - 1}>
              <ListItemText primary={msg}/>
            </ListItem>
          ))}
          <div ref={messagesEndRef}/>
        </List>
        <div className={`${classes.playerMessage} send-player-message`}>
          <input
            name='player-message'
            type="text"
            placeholder={t("table.Chat.YourMessage")}
            autoComplete="off"
            value={playerMessage}
            onChange={e => onChangePlayerMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <DefaultButton
            onClick={sendPlayerMessage}
            disabled={playerMessage === ''}
          >
            {t("table.Chat.Send")}
          </DefaultButton>
        </div>
      </TabPanel>
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {tableId: tableWS.table.id};
};

export default connect(mapStateToProps)(Chat)