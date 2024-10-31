import {makeAction} from "../../../../../backend/table";
import {backendError} from "../../../../../backend/error";
import {errorMessage} from "../../../../../backend";
import {connect} from "react-redux";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../../../redux/actions/table";
import React from "react";
import {ModelPlayerLastGameActionEnum} from "@pokergloss/table-client-typescript";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {adaptChipsToBB} from "../../../util";
import ActionButton from "../../../../UI/Button/ActionButton";
import {setTutorialAction} from "../../../../../redux/actions/tutorial";

const desktopStyles = makeStyles(() => ({
  root: {
    right: '17.75%',
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    bottom: '50%',
    right: '1%',
    width: "12%"
  }
}));

const portraitStyles = makeStyles(() => ({
  root: {
    bottom: "10%",
    right: "1%",
    width: "28%"
  }
}));

const Button = ({tableId, maxRoundBet, currentUserPosition, action, setCpBetting, setBackendError, setActionsVisibility,
                  setTutorialAction, isChipsInBB, bigBlind, isOffline}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isMobile ? (isPortrait ?  portraitStyles() : mobileStyles()) : desktopStyles()

  const onClick = () => {
    if (isOffline) {
      setTutorialAction(action, 0)
      return
    }
    setActionsVisibility(false)
    makeAction(tableId, currentUserPosition, action, 0)
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

  const getText = () => {
    switch (action) {
      case ModelPlayerLastGameActionEnum.Check: return "Check"
      case ModelPlayerLastGameActionEnum.Call:
        const callToChips = Math.max(maxRoundBet, bigBlind)
        return "Call To " + (isChipsInBB ? adaptChipsToBB(callToChips, bigBlind) : callToChips)
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
    maxRoundBet: tableWS.table.maxRoundBet,
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind,
    isOffline: tableWS.isOffline,
  };
};

export default connect(mapStateToProps, {setCpBetting, setBackendError, setActionsVisibility, setTutorialAction})(Button)