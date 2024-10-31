import React from 'react';

import {
  ModelIntentTypeEnum,
  ModelPlayerLastGameActionEnum,
  ModelPlayerStatusEnum,
  ModelTableStatusEnum
} from "@pokergloss/table-client-typescript";
import {
  bigBlindPosition,
  dealerPosition,
  getCurrentUserPlayer,
  isDecidable, isForceAllIn,
  minBettingChipsV2,
  nextDecidablePlayer
} from "../../util";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DefaultCheckBox from "../../../UI/DefaultCheckBox/DefaultCheckBox";
import {deleteIntent, setIntent} from "../../../../backend/table";
import {connect} from "react-redux";
import {backendError} from "../../../../backend/error";
import BetRaiseCheckBox from "./BetRaiseBox";
import {makeStyles} from "@material-ui/core/styles";
import RaiseSlider from "../Actions/RaiseSlider/RaiseSlider";

const desktopStyles = makeStyles(() => ({
  rootIntents: {
    display: 'flex',
    alignItems: 'stretch'
  },
  foldIntent: {},
  checkCallIntents: {},
  betRaiseIntent: {}
}));

const mobileStyles = makeStyles(() => ({
  rootIntents: {},
  foldIntent: {
    position: 'absolute',
    width: '11%',
    bottom: '70%',
    right: '1%',
  },
  checkCallIntents: {
    position: 'absolute',
    width: '11%',
    bottom: '50%',
    right: '1%',
  },
  betRaiseIntent: {
    position: 'absolute',
    width: '11%',
    bottom: '30%',
    right: '1%',
  }
}));

function Intents({table, currentUserPosition}) {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  const currentUserPlayer = () => {
    return getCurrentUserPlayer(table, currentUserPosition)
  }

  const isCurrentUserDeciding = () => {
    if (!currentUserPlayer()) {
      return false
    }
    if (!table || table.decidingPosition === undefined) {
      return false
    }
    return table.decidingPosition === currentUserPosition
  }

  const isSomeoneBetBefore = () => table.maxRoundBet > 0

  function areIntentsAvailable() {
    let cp = currentUserPlayer()
    if (!cp) {
      return false
    }

    if (isCurrentUserDeciding()
      || table.status !== ModelTableStatusEnum.Playing
      || cp.status !== ModelPlayerStatusEnum.Playing
      || cp.lastGameAction === ModelPlayerLastGameActionEnum.Fold
      || cp.lastGameAction === ModelPlayerLastGameActionEnum.AllIn) {
      return false
    }

    if (table.seats.filter(s => s.player && s.player.position === table.decidingPosition).length === 0) {
      return false
    }

    const linkedList = buildLinkedList()
    if (linkedList.length === 0) {
      console.info("Linked list is empty")
      return false
    }
    let currentPlayerIdx = -1
    let decidingPlayerIdx = -1
    let dpp = table.decidingPosition;
    linkedList.forEach((position, i) => {
      if (position === dpp) {
        decidingPlayerIdx = i
      }
      if (position === cp.position) {
        currentPlayerIdx = i
      }
    })
    return currentPlayerIdx > decidingPlayerIdx;

    function buildLinkedList() {
      const lap = table.lastAggressorPosition
      if (lap && lap >= 0) {
        return orderPlayersByFirstPosition(table, lap)
      }

      if (table.maxRoundBet === 0) {
        const firstPlayer = nextDecidablePlayer(table, dealerPosition(table))
        if (!firstPlayer) {
          console.error("Didn't find next decidable player after dealer")
          return []
        }
        return orderPlayersByFirstPosition(table, firstPlayer.position)
      }

      if (table.communityCards.length === 0) { // preflop
        let bbPos = bigBlindPosition(table);
        const firstPlayer = nextDecidablePlayer(table, bbPos)
        if (!firstPlayer) {
          console.error("Didn't find next decidable player after bigBlind")
          return []
        }
        return orderPlayersByFirstPosition(table, firstPlayer.position)
      } else {
        let dPos = dealerPosition(table);
        const firstPlayer = nextDecidablePlayer(table, dPos)
        if (!firstPlayer) {
          console.error("Didn't find next decidable player after bigBlind")
          return []
        }
        return orderPlayersByFirstPosition(table, firstPlayer.position)
      }

      function orderPlayersByFirstPosition(table, firstPosition) {
        return [
          ...table.seats.filter(s => isDecidable(s.player) && s.player.position >= firstPosition).map(s => s.player.position),
          ...table.seats.filter(s => isDecidable(s.player) && s.player.position < firstPosition).map(s => s.player.position),
        ]
      }
    }
  }

  const shouldCall = () => table.maxRoundBet > 0 && currentUserPlayer().totalRoundBet < table.maxRoundBet
  const passiveIntents = () => {
    let result = []

    if (isMobile) {
      if (shouldCall()) {
        result.push(ModelIntentTypeEnum.Call)
      } else {
        result.push(ModelIntentTypeEnum.Check)
      }
    } else {
      if (shouldCall()) {
        result.push(ModelIntentTypeEnum.Call)
        result.push("call-fold")
        result.push(ModelIntentTypeEnum.CallAny)
      } else {
        result.push(ModelIntentTypeEnum.Check)
        result.push(ModelIntentTypeEnum.CheckFold)
        result.push(ModelIntentTypeEnum.CheckCallAny)
      }
    }

    return result
  }

  const currentPlayerIntent = () => {
    let cp = currentUserPlayer()
    if (cp.intent) {
      return cp.intent.type
    } else {
      return ''
    }
  }

  const handleChangeIntent = (event) => {
    if (event.target.checked) {
      setIntent(table.id, currentUserPosition, event.target.name, 0)
        .catch(backendError)
    } else {
      deleteIntent(table.id, currentUserPosition)
        .catch(backendError)
    }
  }

  const intentsCheckbox = intent => {
    return (
      <div className='intent-checkbox' key={intent}>
        <DefaultCheckBox
          checked={currentPlayerIntent() === intent}
          onChange={handleChangeIntent}
          name={intent}
          label={intent}
        />
      </div>
    )
  }

  if (!areIntentsAvailable()) {
    return <div/>
  }

  const minBetChips = minBettingChipsV2(currentUserPlayer(), table.bigBlind, table.maxRoundBet)
  const forceAllIn = isForceAllIn(currentUserPlayer(), table.maxRoundBet)
  const isSliderAvailable = !forceAllIn
  return (
    <>
      <div className={classes.rootIntents}>
        <div className={`intents ${classes.foldIntent}`}>
          {intentsCheckbox(ModelIntentTypeEnum.Fold)}
        </div>
        <div className={`intents ${classes.checkCallIntents}`}>
          {!forceAllIn && passiveIntents().map(intent => intentsCheckbox(intent))}
        </div>
        <div className={`intents ${classes.betRaiseIntent}`}>
          {!isMobile && isSliderAvailable && <RaiseSlider min={minBetChips} currentPlayer={currentUserPlayer()}/>}
          <BetRaiseCheckBox
            totalRoundBet={currentUserPlayer().totalRoundBet}
            cpIntent={currentPlayerIntent()}
            isSomeoneBetBefore={isSomeoneBetBefore()}
            isForceAllIn={forceAllIn}
          />
        </div>
      </div>
      {isMobile && isSliderAvailable && <RaiseSlider min={minBetChips} currentPlayer={currentUserPlayer()}/>}
    </>
  )

}

const mapStateToProps = state => {
  const {tableWS} = state
  return {table: tableWS.table, currentUserPosition: tableWS.currentUserPosition};
};

export default connect(mapStateToProps)(Intents)