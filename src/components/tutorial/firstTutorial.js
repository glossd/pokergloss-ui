import React, {useEffect} from "react";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {
  blinds,
  getInitTable,
  holeCards,
  newBettingRound,
  showCards,
  timeToDecide,
  userOnTable,
  winners,
  playerAction, emoji
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
import useMediaQuery from "@material-ui/core/useMediaQuery";

const FirstTutorial = ({setGirl, setPokerCombinations, clearGirl, goNext, inc, newEvent,
                         setCurrentUserPosition, setActionsVisibility}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const { t } = useTranslation();
  const studentCards = ["Kh", "Jd"]
  const opponentCards = ["Qc", "Ts"]
  const flopCards = ["Js", "Th", "3d"]
  const turnCard = "Ac"
  const riverCard = "Qd"
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
  const action = (pos, pot, type, chips, stack) => {
    tableEvent(EventsTableEventTypeEnum.PlayerAction, playerAction(pos, pot, type, chips, stack))
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

  useEffect(() => {
    stepOne()
    ReactGA.event({
      category: "Tutorial",
      action: "1st lesson rendered " + (isMobile ? "Mobile" : "Desktop"),
    })
  }, [])

  const stepOne = () => {
    tableEvent(EventsTableEventTypeEnum.InitState, getInitTable())
    setCurrentUserPosition(1)
    setGirl({
      message: t("tutorial.lessons.1.1"),
      next: () => {
        stepHoleCards()
        ReactGA.event({
          category: "Tutorial",
          action: "Pressed 1st GotIt " + (isMobile ? "Mobile" : "Desktop")
        })
      }
    })
  }

  const stepHoleCards = () => {
    clearGirl()
    tableEvent(EventsTableEventTypeEnum.Bankroll, userOnTable())
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.HoleCards, holeCards(studentCards)), 300)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.1.2"),
      next: () => {
        stepBlinds()
        ReactGA.event({
          category: "Tutorial",
          action: "Pressed 1st holeCards GotIt",
        })
      }
    }), 1500)
  }

  const stepBlinds = () => {
    clearGirl()
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.Blinds, blinds()), 300)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.1.3"),
      next: () => {
        stepPreFlopAction()
        ReactGA.event({
          category: "Tutorial",
          action: "Pressed 1st blinds GotIt",
        })
      }
    }), 1500)
  }

  const stepPreFlopAction = () => {
    clearGirl()
    subscribeAfter("tutorial-step-actions", (action) => {
      if (action.type === SET_TUTORIAL_ACTION) {
        if (action.action.type === "call") {
          unsubscribe("tutorial-step-actions")
          setActionsVisibility(false)
          stepFlop()
        }
      }
    })
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.TimeToDecide, timeToDecide(1)), 300)
    let showGirl = () => setGirl({
      message: t("tutorial.lessons.1.4"),
      next: clearGirl,
      messageSize: "large",
      highlight: { width: "50%", height: "6%", left: "50%", top: "90%"}
    });
    setTimeout(showGirl, 500)
    setTimeout(() => subscribeAction(() => {
      stepFlop()
      ReactGA.event({
        category: "Tutorial",
        action: "Pressed 1st action CALL",
      })
    }, showGirl, "call", 0), 500)
  }

  const stepFlop = () => {
    for (let i = 1; i < 5; i++) {
      setTimeout(() => actionAndDecide(i, 3 + i*2, "call", 2), (i-1)*500)
    }
    setTimeout(() => actionAndDecide(5, 12, "call", 2), 2000)
    setTimeout(() => action(0, 12, "check", 2), 2500)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound(flopCards, flopCards, 12)), 3000)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.1.5"),
      next: stepFlopPokerCombinations
    }), 4500)
  }

  const stepFlopPokerCombinations = () => {
    clearGirl()
    setPokerCombinations({
      next: () => {
        stepFlopAction()
        ReactGA.event({
          category: "Tutorial",
          action: "Pressed 1st combinations",
        })
      }, tableCards: flopCards, studentCards, answer: combinationIds.Pair})
  }

  const stepFlopAction = () => {
    setTimeout(() => actionAndDecide(5, 12, "check"), 500)
    setTimeout(() => actionAndDecide(0, 12, "check"), 1000)
    setTimeout(() => decide(1), 1500)

    let showGirl = () => setGirl({
      message: t("tutorial.lessons.1.6"),
      next: clearGirl
    });
    setTimeout(showGirl, 2000)
    setTimeout(() => subscribeAction(() => {
      stepFlopActions()
      ReactGA.event({
        category: "Tutorial",
        action: "Pressed 1st action BET",
      })
    }, showGirl, "bet", 6), 2000)
  }

  const stepFlopActions = () => {
    action(1, 18, "bet", 6, 92)
    setTimeout(() => actionAndDecide(2, 18, "fold"), 500)
    setTimeout(() => actionAndDecide(3, 24, "call", 6, 92), 1000)
    setTimeout(() => actionAndDecide(4, 30, "call", 6, 92), 1500)
    setTimeout(() => actionAndDecide(5, 30, "fold"), 2000)
    setTimeout(() => action(0, 30, "fold"), 3000)
    setTimeout(() => setGirl({
      message: t("tutorial.lessons.1.7"),
      next: stepTurn
    }), 4000)
  }

  const stepTurn = () => {
    clearGirl()
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...flopCards, turnCard], [turnCard], 30)), 200)
    setTimeout(() => decide(1), 700)
    setTimeout(() => setPokerCombinations({next: nextGirl, tableCards: [...flopCards, turnCard], studentCards, answer: combinationIds.Pair}), 2000)
    function nextGirl() {
      let showGirl = () => setGirl({
        message: t("tutorial.lessons.1.8"),
        next: clearGirl
      });
      setTimeout(showGirl, 1000)
      setTimeout(() => subscribeAction(stepRiver, showGirl, "check", 0), 1000)
    }
  }

  const stepRiver = () => {
    action(1, 30, "check",0, 92)
    decide(3)
    setTimeout(() => actionAndDecide(3, 30, "check", 0, 92), 500)
    setTimeout(() => action(4, 30, "check", 0, 92), 1000)
    setTimeout(() => event(EventsTableEventTypeEnum.NewBettingRound, newBettingRound([...flopCards, turnCard, riverCard], [riverCard], 30)), 1500)
    setTimeout(() => decide(1), 2000)
    setTimeout(() => setPokerCombinations({next:nextGirl, answer: combinationIds.Straight, tableCards, studentCards}), 3500)
    function nextGirl() {
      const showGirl = () => setGirl({
        message: t("tutorial.lessons.1.9"),
        next: clearGirl
      });
      setTimeout(showGirl, 500)
      setTimeout(() => subscribeAction(stepEnd, showGirl, "bet", 15), 500)
    }
  }

  const stepEnd = () => {
    inc()
    action(1, 45, "bet", 15, 77)
    decide(3)
    setTimeout(() => actionAndDecide(3, 45, "fold"), 1000)
    setTimeout(() => action(4, 60, "call", 15, 77), 2000)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(1, studentCards)), 3000)
    setTimeout(() => tableEvent(EventsTableEventTypeEnum.ShowDown, showCards(4, opponentCards)), 4000)
    setTimeout(() => event(EventsTableEventTypeEnum.Winners, winners(60, 1, tableCards)), 4500)
    setTimeout(() => event("emojiMessage", emoji(0, "like")), 5200)
    setTimeout(() => event("emojiMessage", emoji(4, "rage")), 5500)
    setTimeout(() => setPokerCombinations({next: nextGirl, answer: combinationIds.TwoPair, tableCards, opponentCards}), 6500)
    function nextGirl() {
      setGirl({
        message: t("tutorial.lessons.1.10"),
        pose: tutorialGirlPoses.ok,
        next: ()  => {
          goNext()
          ReactGA.event({
            category: "Tutorial",
            action: "Gone to 2nd lesson",
          })
        }
      })
      ReactGA.event({
        category: "Tutorial",
        action: "1st lesson done",
      })
    }
  }
  return <div/>
}

export default connect(undefined, {newEvent, setCurrentUserPosition, setActionsVisibility, clearGirl, clearPokerCombinations, setGirl, setPokerCombinations}) (FirstTutorial)