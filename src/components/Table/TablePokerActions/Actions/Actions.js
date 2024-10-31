import React from "react";
import {
  ModelPlayerLastGameActionEnum,
  ModelPlayerShowDownActionEnum,
  ModelTableStatusEnum
} from "@pokergloss/table-client-typescript";
import RaiseSlider from "./RaiseSlider/RaiseSlider";
import {availableBettingActions, getCurrentUserPlayer, minBettingChipsV2} from "../../util";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeShowDownAction} from "../../../../backend/table";
import {backendError} from "../../../../backend/error";
import {connect} from "react-redux";
import {setActionsVisibility, setBackendError, setCpBetting} from "../../../../redux/actions/table";
import FoldButton from "./actionButtons/FoldButton";
import CheckCallButton from "./actionButtons/CheckCallButton";
import BetRaiseButton from "./actionButtons/BetRaiseButton";

import {errorMessage} from "../../../../backend";
import MuckButton from "./actionButtons/MuckButton";
import ShowButton from "./actionButtons/ShowButton";
import ActionButton from "../../../UI/Button/ActionButton";
import ShowLeftButton from "./actionButtons/ShowLeftButton";
import ShowRightButton from "./actionButtons/ShowRightButton";

const Actions = ({table, currentUserPosition, currentPlayer, isCpAllIn, setCpBetting, visibility, setActionsVisibility, setBackendError}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')

  const theUser = () => {
    return currentPlayer
  }

  const minChips = () => minBettingChipsV2(currentPlayer, table.bigBlind, table.maxRoundBet)

  const isCurrentUserDeciding = () => {
    if (!theUser()) {
      return false
    }
    if (!table || table.decidingPosition === undefined) {
      return false
    }
    return table.decidingPosition === currentUserPosition
  }

  function isTableWaiting() {
    return table.status === ModelTableStatusEnum.Waiting;
  }

  const userBetLimit = () => Math.min(table.bettingLimitChips-theUser().totalRoundBet, theUser().stack)

  const isPreflop = () => {
    return (table.communityCards && table.communityCards.length === 0)
  }

  const shortCuts = () => {
    let result = []

    result.push({name: 'Min', chips: minChips()})

    let callToFullPot = table.maxRoundBet - theUser().totalRoundBet
    let fullPot = table.totalPot + callToFullPot

    if (isPreflop()) {
      result.push(
        {name: '2.5BB', chips: (2.5*table.bigBlind - theUser().totalRoundBet)},
        {name: '3BB', chips: (3*table.bigBlind - theUser().totalRoundBet)},
        {name: 'Pot', chips: callToFullPot + fullPot}
      );
    } else {
      result.push(
        {name: '1/2 Pot', chips: callToFullPot + Math.floor(0.5 * fullPot)},
        {name: '3/4 Pot', chips: callToFullPot + Math.floor(0.75 * fullPot)},
        {name: 'Pot', chips: callToFullPot + fullPot}
      )
    }

    result.push({name: 'Max', chips: userBetLimit()})

    return result
  }

  function shortCutBtn(shortCut, key) {
    function isEnabled() {
      if (shortCut.name === 'Max' || shortCut.name === 'Min') {
        return true
      }
      return shortCut.chips <= userBetLimit() && shortCut.chips >= minChips()
    }

    return (
      <div key={key} className='quick-bet-btn'>
        <ActionButton
          disabled={!isEnabled()}
          onClick={() => {
            let isAllIn = false
            if (shortCut.chips === theUser().stack) {
              isAllIn = true
            }
            setCpBetting(shortCut.chips, isAllIn)
          }}>{shortCut.name}
        </ActionButton>
      </div>
    )
  }

  const sendShowDownAction = action => {
    if (currentUserPosition >= 0) {
      setActionsVisibility(false)
      makeShowDownAction(table.id, currentUserPosition, action)
        .catch((e) => {
          backendError(e)
          setBackendError(errorMessage(e))
          setTimeout(() => setBackendError(''), 2000)
          setActionsVisibility(true)
        })
    }
  }

  if (currentUserPosition < 0) {
    return <div/>
  }

  if (!visibility) {
    return <div/>
  }

  if (!theUser()) {
    return <div/>
  }

  const isVip = currentPlayer.marketItemCoins > 0

  const aba = availableBettingActions(theUser(), table, isCpAllIn)
  const isForced = aba.isForced
  const actions = aba.actions
  return (
    <div>
      {
        !isTableWaiting() && isCurrentUserDeciding() &&
        <div>
          {
            table.status === ModelTableStatusEnum.Playing &&
            <div>
              {
                !isForced &&
                <div>
                  <div className='quick-bets'>
                    {!isMobile && shortCuts().map((quickBet, key) => shortCutBtn(quickBet, key))}
                  </div>
                  <RaiseSlider min={minChips()} currentPlayer={currentPlayer}/>
                </div>
              }
              <div key={"actions"} className={"betting-actions-container"}>
                {
                  actions.map(action => {
                    if (action === ModelPlayerLastGameActionEnum.Fold) {
                      return <FoldButton key={action}/>
                    }
                    if (action === ModelPlayerLastGameActionEnum.Call ||
                      action === ModelPlayerLastGameActionEnum.Check) {
                      return <CheckCallButton key={action} action={action}/>
                    }
                    return <BetRaiseButton key={action} totalRoundBet={theUser().totalRoundBet} action={action}/>
                  })
                }
              </div>
            </div>
          }
          {
            table.status === ModelTableStatusEnum.ShowDown &&
            <>
              <MuckButton isVip={isVip} onClick={() => {sendShowDownAction(ModelPlayerShowDownActionEnum.Muck)}}/>
              <ShowButton isVip={isVip} onClick={() => {sendShowDownAction(ModelPlayerShowDownActionEnum.Show)}}/>
              {isVip && <ShowLeftButton onClick={() => {sendShowDownAction("showLeft")}}/>}
              {isVip && <ShowRightButton onClick={() => {sendShowDownAction("showRight")}}/>}
            </>
          }
        </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  const currentUserPosition = tableWS.currentUserPosition
  const currentPlayer = getCurrentUserPlayer(tableWS.table, currentUserPosition)
  return {
    table: tableWS.table,
    currentUserPosition: tableWS.currentUserPosition,
    isCpAllIn: tableWS.cpBetting.isAllIn,
    visibility: tableWS.actionsVisibility,
    currentPlayer};
};

export default connect(mapStateToProps, {setCpBetting, setActionsVisibility, setBackendError})(Actions)
