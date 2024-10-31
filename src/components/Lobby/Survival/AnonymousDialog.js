import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import React, {useState} from "react";
import {connect} from "react-redux";
import {setSurvivalAnonymousDialogOpen} from "../../../redux/actions/lobby";
import firebase from "../../../auth/Firebase";
import {startAnonymousSurvival} from "../../../backend/survival";
import {backendError} from "../../../backend/error";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {setIsAnonymous, setIsAuthenticated} from "../../../redux/actions/auth";
import {useRouter} from "next/router";
import Loader from "../../UI/Loader/Loader";

const useStyles = makeStyles(() => ({
  text: {
    maxWidth: '30rem'
  },
  note: {
    maxWidth: '30rem',
    fontSize: "0.7rem",
    color: "orange"
  },
  error: {
    color: "red"
  }
}))

const AnonymousDialog = ({isAnonymousDialogOpen, setSurvivalAnonymousDialogOpen, setIsAnonymous, setIsAuthenticated}) => {
  const classes = useStyles()
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DefaultDialog
      open={!!isAnonymousDialogOpen}
      onClose={() => setSurvivalAnonymousDialogOpen(false)}
      title={t("Survival.anonymous.title")}
      action={{text: t("Survival.anonymous.PlayAnonymously"),
        onClick: () => {
          setIsLoading(true)
          firebase.auth().signInAnonymously()
            .then(() => {
              startAnonymousSurvival()
                .then(s => {
                  setIsAnonymous(true)
                  setIsAuthenticated(true)
                  router.push("/tables/" + s.tableId)
                })
                .catch(e => {
                  setError(backendError(e))
                })
            })
            .catch(console.error)
        },
        disabled: isLoading}}
      cancel={{text: t("Survival.anonymous.SignUp"), onClick: () => router.push("/signup")}}
    >
      <div className={classes.text}>{t("Survival.anonymous.YouCanPlay")}</div>
      <div className={classes.note}>*{t("Survival.anonymous.OfferPool")}</div>
      {error && <div className={classes.error}>{error}</div>}

      {isLoading && <Loader/>}
    </DefaultDialog>
  )
}

const mapStateToProps = state => {
  const { lobby } = state
  return {
    isAnonymousDialogOpen: lobby.isSurvivalAnonymousDialogOpen,
  };
};

export default connect(mapStateToProps, {setSurvivalAnonymousDialogOpen, setIsAuthenticated, setIsAnonymous})(AnonymousDialog)
