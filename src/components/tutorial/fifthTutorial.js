import React, {useEffect} from "react";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {
  blinds,
  getInitTable,
  holeCards,
  newBettingRound,
  showCards,
  timeToDecide,
  playerAction, bot, user, emptySeat, winners, emoji
} from "./events";
import {subscribeAfter, unsubscribe} from "../../redux/redux-subscribe-action";
import {
  clearGirl,
  clearPokerCombinations,
  SET_TUTORIAL_ACTION,
  setGirl,
  setPokerCombinations
} from "../../redux/actions/tutorial";
import {connect} from "react-redux";
import {newEvent} from "../../redux/actions";
import {clearTable, setActionsVisibility, setCurrentUserPosition} from "../../redux/actions/table";
import {useRouter} from "next/router";
import {combinationIds} from "./util";
import {useTranslation} from "next-i18next";
import {tutorialGirlPoses} from "./Girl";
import * as ReactGA from "react-ga";

const FifthTutorial = ({setGirl, setPokerCombinations, clearGirl, inc, newEvent, setCurrentUserPosition, setActionsVisibility, clearTable}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const studentCards = ["5s", "7s"]
  const opponent0Cards = ["Ac", "6h"]
  const opponent5Cards = ["8c", "8h"]
  const opponent3Cards = ["Ks", "Qs"]
  const flopCards = ["Ah", "8s", "6s"]
  const turnCard = "4s"
  const riverCard = "As"
  const tableCards = [...flopCards, turnCard, riverCard]

  const tableEvent = (type, table) => newEvent({type, payload: {table}})
  const event = (type, payload) => newEvent({type, payload})
  const actionAndDecide = (pos, pot, type, chips, stack, nextPos) => {
    action(pos, pot, type, chips, stack)
    const nextPosition = nextPos !== undefined ? nextPos : pos === 5 ? 0 : pos+1
    setTimeout(() => decide(nextPosition), 200)
  }
  const decide = (pos) => {
    tableEvent(EventsTableEventTypeEnum.TimeToDecide, timeToDecide(pos))
  }
  const action = (pos, pot, type, chips, stack, maxRoundBet) => {
    tableEvent(EventsTableEventTypeEnum.PlayerAction, playerAction(pos, pot, type, chips, stack, maxRoundBet))
  }

  useEffect(() => {
    foldStepOne()
  }, [])

  const foldStepOne = () => {
    let initTable = getInitTable()
    initTable.seats = [
      bot(0, 159),
      user(303),
      emptySeat(2),
      bot(3, 84),
      emptySeat(4),
      bot(5, 54),
    ]
    tableEvent(EventsTableEventTypeEnum.InitState, initTable)
    setCurrentUserPosition(1)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(["7s", "2d"], [0, 3, 5])), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds(5, 301, 157)), 900)
    setTimeout(foldStepPreflopActions, 2000)
  }

  function subscribeAction(next, showGirl, type, chips) {
    subscribeAfter("tutorial-step-actions", (action) => {
      if (action.type === SET_TUTORIAL_ACTION) {
        if (action.action.type === type && action.action.chips === chips) {
          unsubscribe("tutorial-step-actions")
          setActionsVisibility(false)
          clearGirl()
          next()
        } else {
          showGirl()
        }
      }
    })
  }

  const foldStepPreflopActions = () => {
    actionAndDecide(3, 7, "raise", 4, 78, 5)
    setTimeout(() => actionAndDecide(5, 11, "call", 4, 50), 500)
    setTimeout(() => actionAndDecide(0, 22, "raise", 12, 72), 1500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.1"),
      next: clearGirl,
    });
    setTimeout(showGirl, 2500)
    setTimeout(() => subscribeAction(foldStepFlop, showGirl, "fold", 0), 2500)
  }

  const foldStepFlop = () => {
    const foldFlop = ["Td", "5s", "7d"]
    actionAndDecide(1, 22, "fold", 2, 301, 3)
    setTimeout(() => actionAndDecide(3, 30, "call", 12, 72, 5), 200)
    setTimeout(() => action(5, 38, "call", 12, 42), 500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(foldFlop, foldFlop, 38, [0,1,3,5])), 1000)
    setTimeout(() => action(0, 38+19, "bet", 19, 128, 3), 2500)
    setTimeout(() => action(3, 38*2, "call", 19, 53, 5), 3000)
    setTimeout(() => action(5, 38*2, "fold", 0, 42), 3000)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...foldFlop, "Ks"], ["Ks"], 76, [0,1,3,5])), 3500)
    setTimeout(() => action(0, 38*4, "bet", 38*2, 52), 5000)
    setTimeout(() => action(3, 38*4, "fold", 0, 53), 6000)
    setTimeout(() => event(EventsTableEventTypeEnum.Winners, winners(38*4, 0, [...foldFlop, "Ks"], [0, 1, 3, 5])), 6500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.2"),
      next: stepResetTable,
    });
    setTimeout(showGirl, 9000)
  }

  const stepResetTable = () => {
    clearGirl()
    let initTable = getInitTable()
    initTable.seats = [
      bot(0, 204),
      user(301),
      emptySeat(2),
      bot(3, 53),
      emptySeat(4),
      bot(5, 42),
    ]
    tableEvent(EventsTableEventTypeEnum.Reset, initTable)
    setCurrentUserPosition(1)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(studentCards, [0, 3, 5])), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds(0, 51, 300, [2, 4])), 900)
    setTimeout(stepPreflop, 2000)
  }

  const stepPreflop = () => {
    actionAndDecide(5, 5, "call", 2, 40)
    setTimeout(() => actionAndDecide(0, 7, "call", 2, 202), 500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.3"),
      next: clearGirl,
    });
    setTimeout(showGirl, 1000)
    setTimeout(() => subscribeAction(stepPreflopAfterCall, showGirl, "call", 0), 1000)
  }

  const stepPreflopAfterCall = () => {
    actionAndDecide(1, 8, "call", 2, 299, 3)
    setTimeout(() => action(3, 8, "check", 2, 51), 500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(flopCards, flopCards, 8, [0,1,3,5])), 1000)
    setTimeout(() => decide(1), 2000)
    setTimeout(() => setPokerCombinations({next: nextGirl, tableCards: flopCards, studentCards, answer: combinationIds.HighCard}), 2500)
    function nextGirl() {
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.5.4"),
        next: clearGirl,
      })
      setTimeout(showGirl, 500)
      setTimeout(() => subscribeAction(stepAfterFlop, showGirl, "bet", 4), 500)
    }
  }

  const stepAfterFlop = () => {
    actionAndDecide(1, 12, "bet", 4, 295, 3)
    setTimeout(() => actionAndDecide(3, 16, "call", 4, 47, 5), 500)
    setTimeout(() => actionAndDecide(5, 24, "raise", 8, 32), 1500)
    setTimeout(() => actionAndDecide(0, 32, "call", 8, 194), 2000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.5"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3000)
    setTimeout(() => subscribeAction(stepTurn, showGirl, "call", 0), 3000)
  }

  const stepTurn = () => {
    actionAndDecide(1, 36, "call", 8, 291, 3)
    setTimeout(() => action(3, 40, "call", 8, 43), 500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...flopCards, turnCard], [turnCard], 80, [0,1,3,5])), 500)
    setTimeout(() => decide(1), 2000)
    setTimeout(() => setPokerCombinations({next: nextGirl, tableCards: [...flopCards, turnCard], studentCards, answer: combinationIds.StraightFlush}), 2500)
    function nextGirl() {
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.5.6"),
        next: clearGirl,
      })
      setTimeout(showGirl, 500)
      setTimeout(() => subscribeAction(stepTurnActions, showGirl, "check", 0), 500)
    }
  }

  const stepTurnActions = () => {
    actionAndDecide(1, 40, "check", 0, 291, 3)
    setTimeout(() => actionAndDecide(3, 45, "bet", 5, 38, 5), 500)
    setTimeout(() => actionAndDecide(5, 55, "raise", 10, 22), 1500)
    setTimeout(() => actionAndDecide(0, 65, "call", 10, 184), 2500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.7"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3500)
    setTimeout(() => subscribeAction(stepRiver, showGirl, "call", 0), 3500)
  }

  const stepRiver = () => {
    actionAndDecide(1, 75, "call", 10, 281, 3)
    setTimeout(() => action(3, 80, "call", 10, 33), 500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(tableCards, [riverCard], 80, [0,1,3,5])), 1000)
    setTimeout(() => decide(1), 2000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.8"),
      next: clearGirl,
    });
    setTimeout(showGirl, 2200)
    setTimeout(() => subscribeAction(stepRiverActions, showGirl, "check", 0), 2200)
  }

  const stepRiverActions = () => {
    actionAndDecide(1, 80, "check", 0, 281, 3)
    setTimeout(() => actionAndDecide(3, 113, "allIn", 33, 0, 5), 500)
    setTimeout(() => actionAndDecide(5, 135, "allIn", 22, 0), 2500)
    setTimeout(() => actionAndDecide(0, 201, "raise", 66, 118), 5000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.5.9"),
      next: clearGirl,
    });
    setTimeout(showGirl, 7200)
    setTimeout(() => subscribeAction(stepRiverEnd, showGirl, "allIn", 281), 7200)
  }

  const stepRiverEnd = () => {
    inc()
    actionAndDecide(1, 482, "allIn", 281, 0, 0)
    setTimeout(() => event("emojiMessage", emoji(0, "rage")), 1000)
    setTimeout(() => action(0, 600, "allIn", 118, 0), 1500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(3, opponent3Cards)), 2500)
    setTimeout(() => setPokerCombinations({next:opponent5ShowDown, answer: combinationIds.Flush, tableCards, opponentCards: opponent3Cards}), 3500)
    function opponent5ShowDown() {
      setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(5, opponent5Cards)), 500)
      setTimeout(() => setPokerCombinations({next:opponent0ShowDown, answer: combinationIds.FullHouse, tableCards, opponentCards: opponent5Cards}), 1500)
      function opponent0ShowDown() {
        setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(0, opponent0Cards)), 500)
        setTimeout(() => setPokerCombinations({next:end, answer: combinationIds.FullHouse, tableCards, opponentCards: opponent0Cards}), 1500)
        function end() {
          setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(1, studentCards)), 500)
          setTimeout(() => event(EventsTableEventTypeEnum.Winners, winners(600, 1, tableCards, [0,1,3,5])), 1000)
          setTimeout(() => setGirl({
            message: t("tutorial.lessons.5.10"),
            pose: tutorialGirlPoses.ok,
            next: () => {
              clearTable()
              clearGirl()
              ReactGA.event({
                category: "Tutorial",
                action: "Gone to Survival",
              })
              router.push("/lobby/survival")
            }
          }), 3000)
        }
      }
    }
  }

  return <div/>
}

export default connect(undefined, {newEvent, setCurrentUserPosition, setActionsVisibility, clearTable, clearGirl, clearPokerCombinations, setGirl, setPokerCombinations}) (FifthTutorial)