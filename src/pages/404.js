import React from "react";
import {useRouter} from "next/router";
import DefaultButton from "../components/UI/Button/DefaultButton/DefaultButton";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const commonStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100vh",
    background: "#f1f1f1",
    fontFamily: "'Lobster', Georgia, Times, serif"
  },
  card: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center"
  },
  number404: {
    color: "#9a0303"
  },
  backButton: {
    background: "rgb(14 192 28)"
  }
}));

const desktopStyles = makeStyles(() => ({
  cardMessage: {
    width: "25vw",
    padding: "1vw",
    display: "block",
    margin: "auto",
    '& > h1': {
      fontSize: "3vw",
      fontWeight: "bold"
    },
    '& > p': {
      fontSize: "1.5vw"
    },
    '& > img': {
      width: "100%"
    }
  }
}));

const portraitStyles = makeStyles(() => ({
  cardMessage: {
    width: "80vw",
    padding: "1vw",
    display: "block",
    margin: "auto",
    '& > h1': {
      fontSize: "11vw",
      fontWeight: "bold"
    },
    '& > p': {
      fontSize: "6vw"
    },
    '& > img': {
      width: "100%",
      marginBottom: "10px"
    }
  }
}));

const mobileStyles = makeStyles(() => ({
  cardMessage: {
    marginTop: "7vw",
    '& > h1': {
      fontSize: "3.2vw",
      fontWeight: "bold"
    },
    '& > img': {
      width: "45%",
      display: "block",
      margin: "auto",
      marginBottom: "10px"
    }
  }
}));

const Error = () => {
  const router = useRouter();
  const {t} = useTranslation();

  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())
  const commonClasses = commonStyles()

  const handleOpenSettings = () => {
    router.push("/")
  }

  return (
    <div className={commonClasses.root}>
      <div className={commonClasses.card}>
        <div className={classes.cardMessage}>
          <h1><span className={commonClasses.number404}>404</span>{t("ErrorPage.title")}</h1>
          <p>{t("ErrorPage.description")}</p>
          <img src="https://storage.googleapis.com/pokerblow/page-404/error-page-kitty.jpg" alt=""/>
        </div>
          <DefaultButton className={commonClasses.backButton}
                         onClick={handleOpenSettings}>{t("ErrorPage.defaultButton")}</DefaultButton>
        </div>
    </div>
  )
}

export const getStaticProps = async ({locale}) => ({props: {...await serverSideTranslations(locale)}})
export default Error;