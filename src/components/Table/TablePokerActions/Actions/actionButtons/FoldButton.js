import React from "react";
import {makeAction} from "../../../../../backend/table";
import {ModelPlayerLastGameActionEnum} from "@pokergloss/table-client-typescript";
import {backendError} from "../../../../../backend/error";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../../../redux/actions/table";
import {errorMessage} from "../../../../../backend";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ActionButton from "../../../../UI/Button/ActionButton";
import {setTutorialAction} from "../../../../../redux/actions/tutorial";

const desktopStyles = makeStyles(() => ({
  root: {
    right: '34.5%',
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    bottom: '70%',
    right: '1%',
    width: "12%"
  }
}));

const portraitStyles = makeStyles(() => ({
  root: {
    bottom: "20%",
    right: "1%",
    width: "28%"
  }
}));

const Button = ({tableId, currentUserPosition, setCpBetting, setBackendError, setTutorialAction, setActionsVisibility, isOffline, className}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isMobile ? (isPortrait ?  portraitStyles() : mobileStyles()) : desktopStyles()

  const onClick = () => {
    if (isOffline) {
      setTutorialAction("fold", 0)
      return
    }
    setActionsVisibility(false)
    makeAction(tableId, currentUserPosition, ModelPlayerLastGameActionEnum.Fold, 0)
      .then(() => {
        setCpBetting(0)
      })
      .catch(error => {
        backendError(error)
        setBackendError(errorMessage(error))
        setTimeout(() => setBackendError(''), 2000)
        setActionsVisibility(true)
      })
  }

  return (
    <div className={`action-btn-root ${classes.root}`}>
      <ActionButton className={className} onClick={onClick}>
        FOLD
      </ActionButton>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return { tableId: tableWS.table.id, currentUserPosition: tableWS.currentUserPosition, isOffline: tableWS.isOffline};
};

export default connect(mapStateToProps, {setBackendError, setCpBetting, setActionsVisibility, setTutorialAction})(Button)