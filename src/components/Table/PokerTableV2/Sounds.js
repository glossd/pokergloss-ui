import React, {useEffect} from "react";
import {
  EventsTableEventTypeEnum, ModelPlayerLastGameActionEnum,
} from "@pokergloss/table-client-typescript";
import useSound from "use-sound";
import {subscribeBefore, unsubscribe} from "../../../redux/redux-subscribe-action";
import {connect} from "react-redux";

const Sounds = ({isSoundActive, currentUserPosition}) => {
  const [playFold, foldData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/fold.mp3", { volume: 0.1, interrupt: true });
  const [playCheck, checkData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/check.mp3", { volume: 0.1, interrupt: true });
  const [playCard, cardData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/card.mp3", { volume: 0.1, interrupt: true });
  const [playBet, betData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/bet.mp3", { volume: 0.1, interrupt: true });
  const [playAllIn, allInData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/all-in-v2.mp3", { volume: 1, interrupt: true});
  const [playWin, winData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/win.mp3", { volume: 0.1, interrupt: true });
  const [playCurrentUserPlayerTurn, currentUserPlayerTurnData] = useSound("https://storage.googleapis.com/pokerblow/poker-table/currentUserPlayerTurn.mp3", { volume: 0.1, interrupt: true });

  const stopSounds = () => {
    foldData.stop()
    checkData.stop()
    cardData.stop()
    betData.stop()
    allInData.stop()
    winData.stop()
    currentUserPlayerTurnData.stop()
    unsubscribe("sounds")
  }

  useEffect(() => {
    return () => {
      stopSounds()
    }
  }, [])

  if (isSoundActive) {
    subscribeBefore("sounds", (action) => {
      if (action.type === EventsTableEventTypeEnum.PlayerAction) {
        const player = action.payload.table.seats[0].player
        switch (player.lastGameAction) {
          case ModelPlayerLastGameActionEnum.Check:
            playCheck()
            break
          case ModelPlayerLastGameActionEnum.Bet:
          case ModelPlayerLastGameActionEnum.Raise:
          case ModelPlayerLastGameActionEnum.Call:
            playBet()
            break
          case ModelPlayerLastGameActionEnum.AllIn:
            playAllIn()
            break
          case ModelPlayerLastGameActionEnum.Fold:
            playFold()
            break
          default:
        }
      }
      if (action.type === EventsTableEventTypeEnum.HoleCards) {
        let countDown = 6
        playCard()
        setTimeout(() => {
          if (countDown > 0) {
            playCard()
            countDown--
          }
        }, 200)
      }
      if (action.type === EventsTableEventTypeEnum.NewBettingRound) {
        playCard()
      }
      if (action.type === EventsTableEventTypeEnum.Winners) {
        playWin()
      }
      if (action.type === EventsTableEventTypeEnum.TimeToDecide) {
        if (currentUserPosition === action.payload.table.seats[0].position) {
          playCurrentUserPlayerTurn()
        }
      }
    });
  } else {
    stopSounds()
  }

  return <div/>
}

const mapStateToProps = state => {
  const { tableWS } = state
  return {currentUserPosition: tableWS.currentUserPosition};
};

export default connect(mapStateToProps)(Sounds)