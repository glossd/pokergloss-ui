import React, {useEffect} from "react";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {
  blinds,
  getInitTable,
  holeCards,
  newBettingRound,
  showCards,
  timeToDecide,
  winners,
  playerAction, bot, user, emptySeat, emoji
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
import {setActionsVisibility, setCurrentUserPosition} from "../../redux/actions/table";
import {combinationIds} from "./util";
import {useTranslation} from "next-i18next";
import {tutorialGirlPoses} from "./Girl";
import * as ReactGA from "react-ga";

// Bluff
const ThirdTutorial = ({setGirl, setPokerCombinations, clearGirl, goNext, inc, newEvent, setCurrentUserPosition, setActionsVisibility}) => {
  const { t } = useTranslation();
  const studentHoleCards = ["Qh", "9h"]
  const opponentCards = ["8c", "4h"]
  const flopCards = ["Ac", "Kh", "Qd"]

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
    stepOne()
  }, [])

  const stepOne = () => {
    let initTable = getInitTable();
    initTable.seats = [
      bot(0, 80),
      user( 240),
      bot(2, 96),
      bot(3, 92),
      emptySeat(4),
      bot(5, 92),
    ]
    tableEvent(EventsTableEventTypeEnum.InitState, initTable)
    setCurrentUserPosition(1)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(studentHoleCards, [0, 2, 3, 5])), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds(0, 94, 239)), 900)
    setTimeout(() => setGirl({
      message:  t("tutorial.lessons.3.1"),
      next: stepPreFlopActions
    }), 1500)
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

  const stepPreFlopActions = () => {
    clearGirl()
    setTimeout(() => actionAndDecide(3, 5, "call", 2, 94, 5), 500)
    setTimeout(() => actionAndDecide(5, 11, "raise", 6, 86), 1000)
    setTimeout(() => actionAndDecide(0, 17, "call", 6, 74), 1500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.3.2"),
      next: clearGirl,
    });
    setTimeout(showGirl, 2000)
    setTimeout(() => subscribeAction(stepPreFlopAfterCall, showGirl, "call", 0), 2000)
  }

  const stepPreFlopAfterCall = () => {
    actionAndDecide(1, 22, "call", 6, 244)
    setTimeout(() => actionAndDecide(2, 22, "fold", 2, 94), 500)
    setTimeout(() => action(3, 26, "call", 6, 86), 1000)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(flopCards, flopCards, 26, [0,1,2,3,5])), 1500)
    setTimeout(() => decide(1), 2800)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.3.3"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3000)
    setTimeout(() => subscribeAction(stepFlopCheck, showGirl, "check", 0), 3000)
  }

  const stepFlopCheck = () => {
    actionAndDecide(1, 26, "check", 0, 234, 3)
    setTimeout(() => actionAndDecide(3, 26, "check", 0, 86, 5), 500)
    setTimeout(() => actionAndDecide(5, 26, "check", 0, 86), 1000)
    setTimeout(() => actionAndDecide(0, 52, "bet", 26, 48), 2000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.3.4"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3000)
    setTimeout(() => subscribeAction(stepEnd, showGirl, "fold", 0), 3000)
  }

  const stepEnd = () => {
    inc()
    actionAndDecide(1, 52, "fold", 0, 234, 3)
    setTimeout(() => actionAndDecide(3, 52, "fold", 0, 86, 5), 500)
    setTimeout(() => action(5, 52, "fold", 0, 86), 1000)
    setTimeout(() => event(EventsTableEventTypeEnum.Winners, winners(52, 0, flopCards, [0,1,2,3,5])), 2000)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(0, opponentCards)), 3000)
    setTimeout(() => event("emojiMessage", emoji(0, "sunglasses")), 3500)
    setTimeout(() => setPokerCombinations({next:nextGirl, answer: combinationIds.HighCard, tableCards: flopCards, opponentCards}), 5000)
    function nextGirl() {
      setTimeout(() => setGirl({
        message: t("tutorial.lessons.3.5"),
        pose: tutorialGirlPoses.ok,
        next: () => {
          goNext()
          ReactGA.event({
            category: "Tutorial",
            action: "Gone to 4nd lesson",
          })
        }
      }), 500)
    }
  }



  return <div/>
}

export default connect(undefined, {newEvent, setCurrentUserPosition, setActionsVisibility, clearGirl, clearPokerCombinations, setGirl, setPokerCombinations}) (ThirdTutorial)