import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import SearchPeople from "../components/Messenger/SearchPeople";
import Chat from "../components/Messenger/Chat";
import ChatList from "../components/Messenger/ChatList";
import MessengerWS from "../backend/messenger/ws";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {connect} from "react-redux";
import {setUnreadCount} from "../redux/actions/messenger";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  searchPeopleContainer: {
    position: 'absolute',
    backgroundColor:"#092435",

    height: '8%'
  },
  backContainer: {
    position: 'absolute',
    backgroundColor:"#092435",
    height: '8%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backBtn: {
    color: "#071117",
    backgroundColor: "#22ea00",
    borderRadius: "8px",
    border: "none",
    overflow: "auto",
    textAlign: "center",
    marginLeft: '4px',
    "&:hover": {
      backgroundColor: "#29ff00",
    }
  },
  allChatsContainer: {
    position: 'absolute',
    backgroundColor:"#092435",
    top: '8%',
    height: '92%'
  },
  chatContainer: {
    position: 'absolute',
    backgroundColor:"#081821",
    height: "100%"
  },
  displayNone: {
    display: "none"
  }
}));

const mobileStyles = makeStyles(() => ({
  allChatsContainer: {
    width: '100%',
    overflowY: 'auto',
  },
  searchPeopleContainer: {
    left: "20%",
    width: '80%',
  },
  backContainer: {
    width: '20%',
  },
  chatContainer: {
    display: 'none'
  },
  openedChatContainer: {
    width: "100%"
  }
}))

const desktopStyles = makeStyles(() => ({
  allChatsContainer: {
    width: '30%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  searchPeopleContainer: {
    left: "6%",
    width: '24%',
  },
  backContainer: {
    width: '6%',
  },
  chatContainer: {
    left:'30%',
    width: '70%',
    maxWidth: "650px",
  }
}))

const Messenger = ({chosenUser, chosenChat, setUnreadCount}) => {
  const classes = useStyles()
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const adaptClasses = isMobile ? mobileStyles() : desktopStyles()
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setUnreadCount(null)
  }, [])

  const isOnlyChatOpen = isMobile && (!!chosenUser || !!chosenChat)

  return (
    <div className={classes.root}>
      <SEO title={"MessengerPage.title"} description={"MessengerPage.description"}/>
      <div className={`${classes.backContainer} ${adaptClasses.backContainer} ${isOnlyChatOpen ? classes.displayNone : ""}`}>
        <button className={classes.backBtn} onClick={() => router.push("/lobby/live")}>{t("Go lobby")}</button>
      </div>
      <div className={`${classes.searchPeopleContainer} ${adaptClasses.searchPeopleContainer} ${isOnlyChatOpen ? classes.displayNone : ""}`}>
        <SearchPeople/>
      </div>
      <div className={`${classes.allChatsContainer} ${adaptClasses.allChatsContainer} ${isOnlyChatOpen ? classes.displayNone : ""}`}>
        <ChatList/>
      </div>
      <div className={`${classes.chatContainer} ${isOnlyChatOpen ? adaptClasses.openedChatContainer : adaptClasses.chatContainer}`}>
        <Chat/>
      </div>
      <MessengerWS/>
    </div>
  )
}

const mapStateToProps = state => {
  const {messenger} = state
  return {
    chosenUser: messenger.chosenUser,
    chosenChat: messenger.chosenChat,
  };
};

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {setUnreadCount}) (Messenger)