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
  playerAction, bot, user, emoji
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

const SecondTutorial = ({setGirl, setPokerCombinations, clearGirl, goNext, inc,
                          newEvent, setCurrentUserPosition, setActionsVisibility}) => {
  const { t } = useTranslation();
  const studentCards = ["Qd", "Qs"]
  const opponentCards = ["Ad", "Kh"]
  const flopCards = ["Qc", "Jh", "Td"]
  const turnCard = "5c"
  const riverCard = "5d"
  const tableCards = [...flopCards, turnCard, riverCard]

  const tableEvent = (type, table) => newEvent({type, payload: {table}})
  const event = (type, payload) => newEvent({type, payload})
  const actionAndDecide = (pos, pot, type, chips, stack) => {
    action(pos, pot, type, chips, stack)
    setTimeout(() => decide(pos === 5 ? 0 : pos+1), 200)
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
      bot(0, 98),
      user( 137),
      bot(2, 98),
      bot(3, 92),
      bot(4, 77),
      bot(5, 98),
    ]
    tableEvent(EventsTableEventTypeEnum.InitState, initTable)
    setCurrentUserPosition(1)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(studentCards)), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds(5, 135, 97)), 900)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.2.1"),
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
    setTimeout(() => actionAndDecide(2, 5, "call", 2, 96), 500)
    setTimeout(() => actionAndDecide(3, 5, "fold", 0, 92), 1000)
    setTimeout(() => actionAndDecide(4, 11, "raise", 6, 71), 2000)
    setTimeout(() => actionAndDecide(5, 17, "call", 6, 92), 2500)
    setTimeout(() => actionAndDecide(0, 22, "call", 6, 92), 3000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.2.2"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3800)

    setTimeout(() => subscribeAction(stepAfterReRaise, showGirl, "raise", 16), 3800)
  }

  const stepAfterReRaise = () => {
    actionAndDecide(1, 39, "raise", 18, 119)
    setTimeout(() => action(2, 38, "fold", 2, 96), 500)
    setTimeout(() => decide(4), 700)
    setTimeout(() => actionAndDecide(4, 50, "call", 18, 59), 1000)
    setTimeout(() => actionAndDecide(5, 50, "fold", 6, 92), 1500)
    setTimeout(() => action(0, 62, "call", 18, 80), 2000)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(flopCards, flopCards, 62)), 2500)
    setTimeout(() => actionAndDecide(0, 62, "check", 0, 80), 3500)
    setTimeout(() => setPokerCombinations({next:nextGirl, answer: combinationIds.ThreeOfAKind, tableCards: flopCards, studentCards}), 4500)
    function nextGirl() {
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.2.3"),
        next: clearGirl,
      });
      setTimeout(showGirl, 500)
      setTimeout(() => subscribeAction(stepFlopBet, showGirl, "bet", 31), 500);
    }
  }

  const stepFlopBet = () => {
    action(1, 93, "bet", 31, 88)
    setTimeout(() => decide(4), 200)
    setTimeout(() => action(4, 152, "allIn", 59, 0), 1000)
    setTimeout(() => decide(0), 1200)
    setTimeout(() => action(0, 152, "fold", 0, 80, 59), 2000)
    setTimeout(() => decide(1), 2200)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.2.4"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3000)
    setTimeout(() => subscribeAction(stepShowDown, showGirl, "call", 0), 3000)
  }

  const stepShowDown = () => {
    action(1, 180, "call", 59, 60)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(1, studentCards)), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(4, opponentCards)), 1000)
    setTimeout(() => setPokerCombinations({next:nextGirl, answer: combinationIds.Straight, tableCards, opponentCards}), 2500)
    function nextGirl() {
      setTimeout(() => setGirl({
        message: t("tutorial.lessons.2.5"),
        next: stepTurnAndRiver,
      }), 500)
    }
  }

  const stepTurnAndRiver = () => {
    clearGirl()
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...flopCards, turnCard], [turnCard], 180)), 1500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(tableCards, [riverCard], 180)), 3000)
    setTimeout(() => event("emojiMessage", emoji(3, "joy")), 4000)
    setTimeout(() => setPokerCombinations({next:nextStudentHand, answer: combinationIds.Straight, tableCards, opponentCards}), 5000)
    function nextStudentHand() {
      setTimeout(() => setPokerCombinations({next:stepWinners, answer: combinationIds.FullHouse, tableCards, studentCards}), 500)
    }
  }

  const stepWinners = () => {
    inc()
    setTimeout(() => event(EventsTableEventTypeEnum.Winners, winners(180, 1, tableCards)), 1000)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.2.6"),
      pose: tutorialGirlPoses.ok,
      next: () => {
        goNext()
        ReactGA.event({
          category: "Tutorial",
          action: "Gone to 3nd lesson",
        })
      }
    }), 2500)
  }

  return <div/>
}

export default connect(undefined, {newEvent, setCurrentUserPosition, setActionsVisibility, clearGirl, clearPokerCombinations, setGirl, setPokerCombinations}) (SecondTutorial)