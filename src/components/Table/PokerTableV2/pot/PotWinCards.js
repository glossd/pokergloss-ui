import React from "react";
import {connect} from "react-redux";
import {handSolve} from "../../../util/handSolve";
import {adaptPokerSolverCard} from "../../util";
import {subscribeAfter} from "../../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum, ModelPlayerShowDownActionEnum} from "@pokergloss/table-client-typescript";
import {setPotWin} from "../../../../redux/actions/table";

const PotWinCards = ({table, currentUserPosition, setPotWin}) => {

  subscribeAfter("potWinCards", (action) => {
    if (action.type === EventsTableEventTypeEnum.Winners ) {
      setTimeout( ()=> startChoosingFiveBestCards(0), 500)
    }
    if (action.type === EventsTableEventTypeEnum.Reset) {
      setPotWin([], [])
    }
  });

  const startChoosingFiveBestCards = (potIdx) => {
    if (potIdx >= table.pots.length) {
      return
    }
    const pot = table.pots[potIdx]
    if (pot.winnerPositions && pot.winnerPositions.length === 1) {
      const winnerPos = pot.winnerPositions[0]
      if (winnerPos === currentUserPosition) {
        if (playerOrEmpty(winnerPos).showDownAction === ModelPlayerShowDownActionEnum.Muck) {
          // current user has open hole cards, but it doesn't mean he showed down them
          return
        }
      }
    }
    updatePotWinningCards(pot)
    if (potIdx+1 < table.pots.length) {
      setTimeout(() => startChoosingFiveBestCards(potIdx+1), 750)
    }
  }

  const playerOrEmpty = (position) => {
    if (position === undefined) {
      return {}
    }
    return table.seats[position].player
  }

  const getPlayerBestCards = (winPos) => {
    const allCards = table.communityCards.concat(playerOrEmpty(winPos).cards)
    let hand = handSolve(allCards)
    return hand.cards.map(c => adaptPokerSolverCard(c.toString()))
  }

  const updatePotWinningCards = (pot) => {
    if (pot.winnerPositions &&
      pot.winnerPositions.length > 0 &&
      playerOrEmpty(pot.winnerPositions[0]).cards &&
      playerOrEmpty(pot.winnerPositions[0]).cards[0] !== "Xx"
    ) {
      let uniqueCards = new Set()
      for (let winPos of pot.winnerPositions) {
        getPlayerBestCards(winPos).forEach(c => uniqueCards.add(c))
      }
      setPotWin(pot.winnerPositions, Array.from(uniqueCards))
    } else {
      setPotWin([], [])
    }
  }

  return <div/>
}

const mapStateToProps = state => {
  const { tableWS } = state
  return { table: tableWS.table, currentUserPosition: tableWS.currentUserPosition };
};

export default connect(mapStateToProps, {setPotWin})(PotWinCards)