import React from "react";
import FoldButton from "../../TablePokerActions/Actions/actionButtons/FoldButton";
import {makeStyles} from "@material-ui/core/styles";
import CheckCallButton from "../../TablePokerActions/Actions/actionButtons/CheckCallButton";
import BetRaiseButton from "../../TablePokerActions/Actions/actionButtons/BetRaiseButton";
import {availableBettingActions, getCurrentUserPlayer, minBettingChipsV2} from "../../util";
import {connect} from "react-redux";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../../redux/actions/table";
import {ModelPlayerLastGameActionEnum} from "@pokergloss/table-client-typescript";
import {ThemeProvider} from "@material-ui/styles";
import defaultTheme from "../../TablePokerActions/themes/defaultTheme";
import RaiseSlider from "../../TablePokerActions/Actions/RaiseSlider/RaiseSlider";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    zIndex: "5",
    width: "100%",
    height: "100%"
  },
  btn: {
    backgroundColor: "#efff00",
    color: "black"
  }
}));

const PortraitActions = ({table, currentPlayer, isCpAllIn}) => {
  const classes = useStyles()
  if (!currentPlayer) {
    return <div/>
  }
  const minBetChips = minBettingChipsV2(currentPlayer, table.bigBlind, table.maxRoundBet)
  const aba = availableBettingActions(currentPlayer, table, isCpAllIn);
  const isForced = aba.isForced
  const actions = aba.actions
  return (
    <ThemeProvider theme={defaultTheme}>
      <div className={classes.root}>
        {
          actions.map(action => {
            if (action === ModelPlayerLastGameActionEnum.Fold) {
              return <FoldButton key={action}/>
            }
            if (action === ModelPlayerLastGameActionEnum.Call ||
              action === ModelPlayerLastGameActionEnum.Check) {
              return <CheckCallButton key={action} action={action}/>
            }
            return <BetRaiseButton key={action} totalRoundBet={currentPlayer.totalRoundBet} action={action}/>
          })
        }
        {actions.length > 0 && !isForced && <RaiseSlider min={minBetChips} currentPlayer={currentPlayer}/>}
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  const currentUserPosition = tableWS.currentUserPosition
  const currentPlayer = getCurrentUserPlayer(tableWS.table, currentUserPosition)
  return {
    table: tableWS.table,
    isCpAllIn: tableWS.cpBetting.isAllIn,
    currentPlayer};
};

export default connect(mapStateToProps, {setCpBetting, setActionsVisibility, setBackendError})(PortraitActions)