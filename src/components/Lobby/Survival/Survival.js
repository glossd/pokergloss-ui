import React, {useEffect, useState} from "react";
import {getMyTickets} from "../../../backend/survival";
import {backendError} from "../../../backend/error";
import Intro from "./Intro";
import SurvivalTicket from "./SurvivalTicket";
import {makeStyles} from "@material-ui/core/styles";
import TextShadow from "../../UI/TextShadow/TextShadow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import AnonymousDialog from "./AnonymousDialog";
import NoTicketsDialog from "./NoTicketsDialog";

const portraitStyles = makeStyles(() => ({
  root: {
    backgroundImage: "url('https://storage.googleapis.com/pokerblow/lobby/survival-background-portrait.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    height: "78vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: "center",
    position: "relative"
  },
  msgBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    bottom: '8vh',
  },
  ticketsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: "column",
    top: '15vw',
  },
  ticketsNumberWithIcon: {
    display: 'flex',
    alignItems: 'center',
    height: '18vw',
  },
  ticketsNumber: {
    fontSize: "25vw",
    lineHeight: '30vw',
    fontFamily: 'Times, serif',
  },
  ticketIcon: {
    width: '35vw',
    height: '35vw',
    marginLeft: '1vw',
  },
  ticketsText: {
    fontSize: "9vw",
    fontFamily: 'Lobster, Georgia, Times, serif',
  },
  errorText: {
    color: '#ff1414',
    fontSize: "5vw",
  },
  articleLink: {
    position: "absolute",
    bottom: "1%",
    right: "1%",
  }
}))

const landscapeStyles = makeStyles(() => ({
  root: {
    backgroundImage: "url('https://storage.googleapis.com/pokerblow/lobby/survival-dark-background-2.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100vw",
    height: "56.25vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: "center",
    position: "relative"
  },
  msgBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15%",
  },
  ticketsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: "column",
    top: '7vw',
  },
  ticketsNumberWithIcon: {
    display: 'flex',
    alignItems: 'center',
    height: '7vw',
  },
  ticketsNumber: {
    fontSize: "9vw",
    lineHeight: '10vw',
  },
  ticketIcon: {
    width: '15vw',
    height: '15vw',
    marginLeft: '1vw',
  },
  ticketsText: {
    fontSize: "4vw",
    fontFamily: 'Lobster, Georgia, Times, serif',
  },
  errorText: {
    color: '#ff1414',
    fontSize: "2.3vw",
  },
  articleLink: {
    position: "absolute",
    bottom: "1%",
    right: "1%",
  }
}))

const Survival = ({isAuthenticated, isEmailVerified, isAnonymous}) => {
  const { t } = useTranslation();
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const adaptClasses = isPortrait ? portraitStyles() : landscapeStyles()

  const [tickets, setTickets] = useState(null)
  useEffect(() => {
    if (isAuthenticated && !isAnonymous) {
      getMyTickets()
        .then(r => setTickets(r.tickets))
        .catch(backendError)
    }
  }, [isAuthenticated, isAnonymous])

  return (
    <div className={adaptClasses.root}>
      {
        tickets != null &&
        <div className={adaptClasses.msgBox}>
          <div className={adaptClasses.ticketsContainer}>
            <div className={adaptClasses.ticketsNumberWithIcon}>
              <TextShadow className={adaptClasses.ticketsNumber}>{tickets}</TextShadow>
              <div className={adaptClasses.ticketIcon}><SurvivalTicket/></div>
            </div>
            <TextShadow className={adaptClasses.ticketsText}>{t("Survival.ticketsLeft")}</TextShadow>
          </div>

          {
            tickets === 0 &&
            <TextShadow className={adaptClasses.errorText}>{t("Survival.noTicketsMessage")}</TextShadow>
          }

          <Intro tickets={tickets}/>
        </div>
      }

      {
        (isAnonymous || isAuthenticated === false || isEmailVerified === false) &&
        <div className={adaptClasses.msgBox}>
          <Intro tickets={tickets}/>
        </div>
      }
      <AnonymousDialog/>
      <NoTicketsDialog/>
      <a className={adaptClasses.articleLink} href="https://info.pokerblow.com/articles/survival" target="_blank">
        <HelpOutlineIcon/> {t("lobby.Survival")}
      </a>
    </div>
  );
}

const mapStateToProps = state => {
  const { auth } = state
  return {
    isAuthenticated: auth.isAuthenticated,
    isEmailVerified: auth.isEmailVerified,
    isAnonymous: auth.isAnonymous,
  };
};

export default connect(mapStateToProps)(Survival)
