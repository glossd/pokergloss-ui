import React from "react";
import {makeAction} from "../../../../../backend/table";
import {backendError} from "../../../../../backend/error";
import {errorMessage} from "../../../../../backend";
import {connect} from "react-redux";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../../../redux/actions/table";
import {ModelPlayerLastGameActionEnum} from "@pokergloss/table-client-typescript";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {adaptChipsToBB} from "../../../util";
import ActionButton from "../../../../UI/Button/ActionButton";
import {setTutorialAction} from "../../../../../redux/actions/tutorial";

const desktopStyles = makeStyles(() => ({
  root: {
    right: '1%',
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    bottom: '30%',
    right: '1%',
    width: "12%"
  }
}));

const portraitStyles = makeStyles(() => ({
  root: {
    bottom: "1%",
    right: "1%",
    width: "28%"
  }
}));

const Button = ({tableId, currentUserPosition, totalRoundBet, action, cpBetting, setCpBetting, setBackendError,
                  setActionsVisibility, setTutorialAction, isChipsInBB, bigBlind, isOffline}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isMobile ? (isPortrait ?  portraitStyles() : mobileStyles()) : desktopStyles()

  const onClick = () => {
    if (isOffline) {
      setTutorialAction(action, cpBetting.chips)
      return
    }
    setActionsVisibility(false)
    makeAction(tableId, currentUserPosition, action, cpBetting.chips)
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

  const betValue = () => {
    if (isChipsInBB) {
      return adaptChipsToBB(cpBetting.chips + totalRoundBet, bigBlind)
    }
    return cpBetting.chips + totalRoundBet
  }

  const getText = () => {
    switch (action) {
      case ModelPlayerLastGameActionEnum.Bet: return "Bet " + betValue()
      case ModelPlayerLastGameActionEnum.Raise:  return "Raise To " + betValue()
      case ModelPlayerLastGameActionEnum.AllIn: return "All-In"
    }
  }

  return (
    <div className={`action-btn-root ${classes.root}`}>
      <ActionButton onClick={onClick}>
        {getText()}
      </ActionButton>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return { tableId: tableWS.table.id,
    currentUserPosition: tableWS.currentUserPosition,
    cpBetting: tableWS.cpBetting,
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind,
    isOffline: tableWS.isOffline,
  };
};

export default connect(mapStateToProps, {setCpBetting, setBackendError, setActionsVisibility, setTutorialAction})(Button)
