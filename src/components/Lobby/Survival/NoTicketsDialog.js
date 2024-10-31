import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import React, {useState} from "react";
import {connect} from "react-redux";
import {setSurvivalNoTicketsDialogOpen} from "../../../redux/actions/lobby";
import {startSurvivalIdle} from "../../../backend/survival";
import {backendError} from "../../../backend/error";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

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

const NoTicketsDialog = ({isNoTicketsDialogOpen, setSurvivalNoTicketsDialogOpen}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("")
  return (
    <DefaultDialog
      open={!!isNoTicketsDialogOpen}
      onClose={() => setSurvivalNoTicketsDialogOpen(false)}
      title={t("Survival.noTickets.title")}
      action={{text: t("Survival.noTickets.Play"), onClick: () => {
          startSurvivalIdle()
            .then(res => {
              router.push("/tables/" + res.tableId)
            })
            .catch(e => {
              setError(backendError(e))
            })
        }}}
      cancel={{text: t("Survival.noTickets.Close"), onClick: () => setSurvivalNoTicketsDialogOpen(false)}}
    >
      <div className={classes.text}>{t("Survival.noTickets.text")}</div>
      {error && <div className={classes.error}>{error}</div>}
    </DefaultDialog>
  )
}

const mapStateToProps = state => {
  const { lobby } = state
  return {
    isNoTicketsDialogOpen: lobby.isSurvivalNoTicketsDialogOpen,
  };
};

export default connect(mapStateToProps, {setSurvivalNoTicketsDialogOpen})(NoTicketsDialog)
