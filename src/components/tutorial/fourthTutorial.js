import React, {useEffect} from "react";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {
  blinds,
  getInitTable,
  holeCards,
  newBettingRound,
  showCards,
  timeToDecide,
  playerAction, bot, user, emptySeat, winnerSeatsReset, emoji
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

const FourthTutorial = ({setGirl, setPokerCombinations, clearGirl, goNext, inc, newEvent, setCurrentUserPosition, setActionsVisibility}) => {
  const { t } = useTranslation();
  const studentCards = ["Th", "9h"]
  const opponent0Cards = ["As", "Tc"]
  const opponent2Cards = ["Ac", "Ah"]
  const flopCards = ["Kh", "Ts", "4h"]
  const turnCard = "Td"
  const riverCard = "4c"
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
    stepOne()
  }, [])

  const stepOne = () => {
    let initTable = getInitTable();
    initTable.seats = [
      bot(0, 100),
      user(234),
      bot(2, 94),
      bot(3, 86),
      emptySeat(4),
      bot(5, 86),
    ]
    tableEvent(EventsTableEventTypeEnum.InitState, initTable)
    setCurrentUserPosition(1)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(studentCards, [0, 2, 3, 5])), 500)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds(1, 84, 93)), 900)
    setTimeout(stepPreFlopActions, 2000)
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
    actionAndDecide(5, 5, "call", 2, 84)
    setTimeout(() => actionAndDecide(0, 11, "raise", 6, 94), 500)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.4.1"),
      next: clearGirl,
    });
    setTimeout(showGirl, 1500)
    setTimeout(() => subscribeAction(stepPreFlopAfterCall, showGirl, "call", 0), 1500)
  }

  const stepPreFlopAfterCall = () => {
    actionAndDecide(1, 17, "call", 6, 228)
    setTimeout(() => actionAndDecide(2, 28, "raise", 12, 82), 500)
    setTimeout(() => actionAndDecide(3, 28, "fold", 2, 84, 5), 1500)
    setTimeout(() => actionAndDecide(5, 38, "call", 12, 74), 2000)
    setTimeout(() => actionAndDecide(0, 44, "call", 12, 88), 2500)
    setTimeout(() => decide(1), 3000)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.4.2"),
      next: clearGirl,
    });
    setTimeout(showGirl, 3500)
    setTimeout(() => subscribeAction(stepFlop, showGirl, "call", 0), 3500)
  }

  const stepFlop = () => {
    action(1, 50, "call", 12, 222)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(flopCards, flopCards, 50, [0,1,2,3,5])), 500)
    setTimeout(() => setPokerCombinations({next:actions, answer: combinationIds.Pair, tableCards: flopCards, studentCards}), 1500)
    function actions() {
      decide(2)
      setTimeout(() => actionAndDecide(2, 60, "bet", 10, 72, 5), 1000)
      setTimeout(() => actionAndDecide(5, 70, "call", 10, 64), 1700)
      setTimeout(() => actionAndDecide(0, 80, "call", 10, 78), 2400)
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.4.3"),
        next: clearGirl,
      });
      setTimeout(showGirl, 3500)
      setTimeout(() => subscribeAction(stepTurn, showGirl, "call", 0), 3500)
    }
  }

  const stepTurn = () => {
    action(1, 52, "call", 10, 234)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...flopCards, turnCard], [turnCard], 80, [0,1,2,3,5])), 500)
    setTimeout(() => setPokerCombinations({next:actions, answer: combinationIds.ThreeOfAKind, tableCards: [...flopCards, turnCard], studentCards}), 1800)
    function actions() {
      decide(2)
      setTimeout(() => actionAndDecide(2, 90, "bet", 10, 62, 5), 1000)
      setTimeout(() => actionAndDecide(5, 100, "call", 10, 54), 1500)
      setTimeout(() => actionAndDecide(0, 150, "raise", 50, 28), 2500)
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.4.4"),
        next: clearGirl,
      });
      setTimeout(showGirl, 4000)
      setTimeout(() => subscribeAction(stepRiver, showGirl, "call", 0), 4000)
    }
  }

  const stepRiver = () => {
    actionAndDecide(1, 200, "call", 50, 184)
    setTimeout(() => actionAndDecide(2, 250, "call", 50, 12, 5), 500)
    setTimeout(() => action(5, 250, "fold", 10, 54), 1000)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(tableCards, [riverCard], 250, [0,1,2,3,5])), 1500)
    setTimeout(() => setPokerCombinations({next:actions, answer: combinationIds.FullHouse, tableCards, studentCards}), 3000)
    function actions() {
      setTimeout(() => actionAndDecide(2, 262, "allIn", 12, 0, 0), 1000)
      setTimeout(() => actionAndDecide(0, 290, "allIn", 28, 0), 2000)
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.4.5"),
        next: clearGirl,
      });
      setTimeout(showGirl, 3000)
      setTimeout(() => subscribeAction(stepEnd, showGirl, "call", 0), 3000)
    }
  }

  const stepEnd = () => {
    inc()
    action(1, 318, "call", 28, 144)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(2, opponent2Cards)), 500)
    setTimeout(() => setPokerCombinations({next:nextOpponentShowDown, answer: combinationIds.TwoPair, tableCards, opponentCards: opponent2Cards}), 1500)
    function nextOpponentShowDown() {
      setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(0, opponent0Cards)), 500)
      setTimeout(() => setPokerCombinations({next:nextStudentShowDown, answer: combinationIds.FullHouse, tableCards, opponentCards: opponent0Cards}), 1500)
      function nextStudentShowDown() {
        setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(1, studentCards)), 500)
        setTimeout(() => tableEvent(EventsTableEventTypeEnum.Winners, {
          "pots": [
            {
              "chips": 286,
              "winnerPositions": [0, 1]
            },
            {
              "chips": 32,
              "winnerPositions": [0, 1]
            }
          ],
          "seats": winnerSeatsReset([0,1,2,3,5]),
          "status": "gameEnd",
          "totalPot": 318,
          "winners": [
            {
              "chips": 159,
              "position": 0,
            },
            {
              "chips": 159,
              "position": 1,
            }
          ]
        }), 1000)

        setTimeout(() => event("emojiMessage", emoji(0, "like")), 2000)

        setTimeout(() => setGirl({
          message: t("tutorial.lessons.4.6"),
          pose: tutorialGirlPoses.ok,
          next: () => {
            goNext()
            ReactGA.event({
              category: "Tutorial",
              action: "Gone to 5nd lesson",
            })
          }
        }), 3500)
      }
    }
  }
  return <div/>
}

export default connect(undefined, {newEvent, setCurrentUserPosition, setActionsVisibility, clearGirl, clearPokerCombinations, setGirl, setPokerCombinations}) (FourthTutorial)