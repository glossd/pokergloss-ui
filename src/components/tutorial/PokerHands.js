import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "../Table/Card/Card";
import {useTranslation} from "next-i18next";
import {isIOS} from "react-device-detect";
import {combinationIds, rootStyle} from "./util";
import {connect} from "react-redux";
import {clearPokerCombinations} from "../../redux/actions/tutorial";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 12,
  },
  card: {
    margin: "0 0.1vw",
    backgroundColor: "black"
  },
  closeButton: {
    color: "white",
    backgroundColor: "#088c08",
    position: "absolute",
    right: "-2%",
    top: "-7%"
  }
}))

const desktopStyles = makeStyles(() => ({
  hands: {
    position: "relative",
    display: 'grid',
    gridAutoFlow: "column",
    gridTemplateRows: 'auto auto auto',
    gridTemplateColumns: '30vw 30vw 30vw',
    gridGap: '10px',
  },
  card: {
    margin: "0 0.1vw",
    backgroundColor: "black"
  },
  exploredCards: {
    width: "25vw"
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: "2vw",
  },
  answerMessage: {
    color: "white",
    fontWeight: "bold",
    fontSize: "2vw",
  },
  handName: {
    color: "white",
    fontWeight: "bold",
    fontSize: "2vw",
  },
  hand: {
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      filter: "brightness(1.35)",
      cursor: "pointer"
    }
  },
  handCards: {
    display: "flex",
    justifyContent: "center",
  },
}))

const portraitStyles = makeStyles(() => ({
  hands: {
    display: "grid",
    gridGap: "10px",
    position: "relative",
    gridAutoFlow: "column",
    gridTemplateRows: "auto auto auto auto auto auto auto auto auto",
    gridTemplateColumns: "100vw"
  },
  card: {
    margin: "0 0.3vw",
    backgroundColor: "black"
  },
  exploredCards: {
    width: "fit-content"
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: "5vw",
  },
  answerMessage: {
    color: "white",
    fontWeight: "bold",
    fontSize: "7vw",
    minHeight: "20vw",
    margin: "3vw 0"
  },
  handName: {
    color: "white",
    fontWeight: "bold",
    fontSize: "5vw",
    width: "40vw",
    textAlign: "end",
    paddingRight: "3px"
  },
  hand: {
    display: "flex",
  },
  handCards: {
    display: "flex",
    justifyContent: "space-evenly",
  },
}))

let inDevEnvironment = false;
if (process && process.env.NODE_ENV === 'development') {
  inDevEnvironment = true;
}

const PokerHands = ({close, clearPokerCombinations, tableCards, studentCards=[], opponentCards=[], answer}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const platformClasses = isPortrait ? portraitStyles() : desktopStyles()
  const handCardWidthVW = isPortrait ? 10 : 4.5
  const displayCardWidthVW = isPortrait ? 12 : 4.5

  const [answerMessage, setAnswerMessage] = useState({message: t("tutorial.pokerHands.allPokerHands"), color: ""})

  const [audioRightChoice] = useState(new Audio("https://storage.googleapis.com/pokerblow/tutorial/sounds/rightChoice.mp3"))
  const [audioWrongChoice] = useState(new Audio("https://storage.googleapis.com/pokerblow/tutorial/sounds/wrongChoice.mp3"))

  const exploredCards = [
    {
      cards: opponentCards,
      name: t("tutorial.pokerHands.opponentCards")
    },
    {
      cards: tableCards,
      name: t("tutorial.pokerHands.tableCards")
    },
    {
      cards: studentCards,
      name: t("tutorial.pokerHands.studentCards")
    }
  ]

  function upTwoCards(cards, name) {
    if (cards.length === 0) {
      return
    }

    return (
      <div className={platformClasses.exploredCards} key={name}>
        <div className={platformClasses.text}>{name}</div>
        <div className={platformClasses.handCards}>
          {
            cards.map((card, index) => {
              return (
                <div key={index} className={platformClasses.card}>
                  <Card
                    cardStr={card}
                    cardFace="up"
                    widthVW={displayCardWidthVW}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }

  const hands = [
    {
      id: combinationIds.StraightFlush,
      name: t("table.HandName.Straight Flush"),
      cards: ["9s", 'Ts', "Js", "Qs", "Ks"],
      shadowedFromRight: 0
    },
    {
      id: combinationIds.FourOfAKind,
      name: t("table.HandName.Four of a Kind"),
      cards: ['Kd', "Kh", "Ks", "Kc", "Js"],
      shadowedFromRight: 1
    },
    {
      id: combinationIds.FullHouse,
      name: t("table.HandName.Full House"),
      cards: ['Ks', "Kc", "Kd", "Th", "Tc"],
      shadowedFromRight: 0
    },
    {
      id: combinationIds.Flush,
      name: t("table.HandName.Flush"),
      cards: ['Ks', "2s", "7s", "Js", "4s"],
      shadowedFromRight: 0
    },
    {
      id: combinationIds.Straight,
      name: t("table.HandName.Straight"),
      cards: ['9h', "Tc", "Jd", "Qd", "Kc"],
      shadowedFromRight: 0
    },
    {
      id: combinationIds.ThreeOfAKind,
      name: t("table.HandName.Three of a Kind"),
      cards: ['Kd', "Ks", "Kc", "2d", "7s"],
      shadowedFromRight: 2
    },
    {
      id: combinationIds.TwoPair,
      name: t("table.HandName.Two Pair"),
      cards: ['Kd', "Kh", "Ts", "Tc", "4h"],
      shadowedFromRight: 1
    },
    {
      id: combinationIds.Pair,
      name: t("table.HandName.Pair"),
      cards: ['Kd', "Kh", "6d", "7s", "2c"],
      shadowedFromRight: 3
    },
    {
      id: combinationIds.HighCard,
      name: t("table.HandName.High Card"),
      cards: ['Ks', "7c", "3d", "5h", "8d"],
      shadowedFromRight: 4
    }
  ]

  // useEffect(() => {
  //   if (inDevEnvironment) {
  //     clearPokerCombinations()
  //     if (close) {
  //       close()
  //     }
  //   }
  // })

  function playAudio(audio, volume) {
    audio.volume = volume
    audio.play()
  }

  // also shows default 'select combination' message
  function chooseAnswer(combinationId) {
    if (combinationId === answer) {
      setAnswerMessage({message: t("tutorial.pokerHands.rightAnswer"), color: "#2bff0a"})
      setTimeout(() => {
        clearPokerCombinations()
        close()
      }, 1000)
      playAudio(audioRightChoice, 0.5)
    } else {
      setAnswerMessage({message: t("tutorial.pokerHands.wrongAnswer"), color: "#fffb0a"})
      playAudio(audioWrongChoice, 0.25)
    }

    setTimeout(() => setAnswerMessage({message: t("tutorial.pokerHands.allPokerHands"), color: ""}), 2000)
  }

  if (!close) {
    return <div/>
  }

  return (
    <div
      style={rootStyle(isIOS && !isPortrait)}
      className={classes.root}
    >
      <div>
        <div className={platformClasses.handCards}>
          {exploredCards.map(cards => upTwoCards(cards.cards, cards.name))}
        </div>

        <div className={platformClasses.answerMessage} style={{ color: answerMessage.color }}>
          {answerMessage.message}
        </div>
      </div>

      <div className={platformClasses.hands}>
        {
          hands.map((hand, index) => {
            return (
              <div key={index} className={platformClasses.hand} onClick={() => chooseAnswer(hand.id)}>
                <div className={platformClasses.handName}>{index+1}. {hand.name}</div>
                <div className={platformClasses.handCards}>
                  {
                    hand.cards.map((card, index) =>
                      (
                        <div key={index} className={platformClasses.card}>
                          <Card
                            cardStr={card}
                            cardFace="up"
                            isShadow={index >= (hand.cards.length - hand.shadowedFromRight)}
                            widthVW={handCardWidthVW}
                          />
                        </div>
                      )
                    )
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const {tutorial} = state
  const pokerCombinations = tutorial.pokerCombinations
  return {
    close: pokerCombinations.next,
    tableCards: pokerCombinations.tableCards,
    studentCards: pokerCombinations.studentCards,
    opponentCards: pokerCombinations.opponentCards,
    answer: pokerCombinations.answer
  };
};


export default connect(mapStateToProps, {clearPokerCombinations}) (PokerHands)