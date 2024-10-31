import React, {useEffect, useState} from "react";

import {getCurrentUser} from '../auth/Firebase'
import {useRouter} from "next/router";
import {connect} from "react-redux";
import DefaultButton from "../components/UI/Button/DefaultButton/DefaultButton";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import {makeStyles} from "@material-ui/core/styles";

const commonStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "'Lobster', Georgia, Times, serif",
  },
  errorMessage: {
    color: "red",
  },
  successMessage: {
    color: "green",
  },
  buttonsContainer: {
    textAlign: "center",
    marginTop: "10px",
  },
  backButton: {
    background: "rgb(47 73 120)",
    marginRight: "10px",
    '&:hover': {
      background: "#1a56a1",
    }
  },
}));

const desktopStyles = makeStyles(() => ({
  container: {
    width: "30vw",
    padding: "1vw",
    backgroundColor: "#f1f1f1",
    display: "block",
    margin: "auto",
    '& > img': {
      width: "100%",
      textAlign: "center",
    }
  },
  arrivalInfo: {
    color: "red",
    textAlign: "center",
    fontWeight: "bolder",
    fontSize: "1vw",
  },
}));

const portraitStyles = makeStyles(() => ({
  container: {
    width: "85vw",
    padding: "1vw",
    backgroundColor: "#f1f1f1",
    display: "block",
    margin: "auto",
    '& > h1': {
      fontSize: "10vw",
    },
    '& > h4': {
      fontSize: "6vw",
    },
    '& > img': {
      width: "100%",
      textAlign: "center",
    }
  },
  arrivalInfo: {
    color: "red",
    textAlign: "center",
    fontWeight: "bolder",
    fontSize: "3.8vw",
  },
}))

const mobileStyles = makeStyles(() => ({
  container: {
    width: "30vw",
    padding: "1vw",
    backgroundColor: "#f1f1f1",
    display: "block",
    margin: "auto",
    '& > h1': {
      fontSize: "2.5vw",
    },
    '& > h4': {
      fontSize: "2vw",
    },
    '& > img': {
      width: "100%",
      textAlign: "center",
    }
  },
  arrivalInfo: {
    color: "red",
    textAlign: "center",
    fontWeight: "bolder",
    fontSize: "1.4vw",
  },
}));

const actionCodeSettings = {
  url: "https://pokerblow.com/refresh-token"
}

const VerifyEmail = ({isJustSignUp}) => {
  const router = useRouter();
  const {t} = useTranslation();

  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())
  const commonClasses = commonStyles()

  const [message, setMessage] = useState("")
  const [isError, setError] = useState(false)
  const [showVerifyButton, setShowVerifyButton] = useState(true)

  const sendVerificationLink = () => {
    getCurrentUser().then(user => {
      if (!user) {
        router.push("/signin")
      } else {
        setShowVerifyButton(false)
        user.sendEmailVerification(actionCodeSettings)
          .then(() => setMessage(t("VerifyPage.Msg.Success")))
          .catch(e => {
            setShowVerifyButton(false)
            console.error(e)
            setError(true)
            setMessage(t("VerifyPage.Msg.Fail"))
          })
      }
    })
  }

  useEffect(() => {
    if (isJustSignUp) {
      sendVerificationLink()
    }
    getCurrentUser().then(user => {
      if (!user) {
        router.push("/signin")
        return
      }
      if (user.emailVerified) {
        router.push("/lobby/live")
      }
    })
  }, [])

  return (
    <div className={commonClasses.root}>
      <SEO title={"VerifyEmail.title"} description={"VerifyEmail.description"}/>

      <div className={classes.container}>
        <h1>{t("VerifyPage.Verification")}</h1>
        <img src="https://storage.googleapis.com/pokerblow/verify-email-page/verify-email-letter.gif" alt=""/>
        <h4 className={isError ? commonClasses.errorMessage : commonClasses.successMessage}>
          {message}
        </h4>
        <h4>{t("VerifyPage.Msg.Info")}</h4>

        <div className={classes.arrivalInfo}>
          {t("VerifyPage.Msg.ArrivalInfo")}
        </div>
      </div>

      <div className={commonClasses.buttonsContainer}>
        {
          isJustSignUp ?
          <DefaultButton
            onClick={() => router.push("/lobby/live")}>
            {t("VerifyPage.Button.Lobby")}
          </DefaultButton>
          :
          <div>
            <DefaultButton
              className={commonClasses.backButton}
              onClick={() => router.go(-1)}>
              {t("VerifyPage.Button.Back")}
            </DefaultButton>
            {
              showVerifyButton &&
              <DefaultButton onClick={sendVerificationLink}>
                {t("VerifyPage.Button.Verify")}
              </DefaultButton>
            }
          </div>
        }
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    isJustSignUp: state.lobby.isJustSignUp
  }
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps)(VerifyEmail)