import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Welcome from "../components/Landing/Welcome";
import Advantages from "../components/Landing/Advantages";
import Contacts from "../components/Landing/Contacts";
import Footer from "../components/Footer/Footer";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import GoldButton from "../components/Landing/GoldButton";
import * as ReactGA from "react-ga";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useRouter} from "next/router";
import Tournament from "../components/Landing/Tournament";
import Leaderboard from "../components/Landing/Leaderboard";
import Tutorial from "../components/Landing/Tutorial";

const desktopStyles = makeStyles(() => ({
  root: {
    backgroundColor: "black",
    textAlign: "center",
  },
  lobbyButton: {
    width: "50%",
    fontSize: "3em",
    margin: "1em",
  },
}));

const mobileStyles = makeStyles(() => ({
  root: {
    backgroundColor: "black",
    textAlign: "center",
  },
  lobbyButton: {
    width: "80%",
    fontSize: "2em",
    margin: "1em",
  }
}));

const Index = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  const router = useRouter();
  const goLobby = () => {
    ReactGA.event({
      category: "Landing",
      action: "Go To Lobby",
    });
    router.push("/lobby/survival")
  }

  return (
    <div className={classes.root}>
      <SEO title={"title"} description={"description"} keywords={"keywords"}/>
      <Welcome/>
      <Advantages/>
      <Tutorial/>
      <Tournament/>
      <Contacts/>
      <Leaderboard/>

      <GoldButton className={classes.lobbyButton} onClick={goLobby}>
        {t("Landing.lobby")}
      </GoldButton>
      <Footer/>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})
export default Index
