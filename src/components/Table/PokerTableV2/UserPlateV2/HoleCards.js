import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Card from "../../Card/Card";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {
  EventsTableEventTypeEnum,
  ModelPlayerStatusEnum,
  ModelTableStatusEnum
} from "@pokergloss/table-client-typescript";
import {subscribeBefore, unsubscribe} from "../../../../redux/redux-subscribe-action";

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    marginTop: '-17%',
    zIndex: '-2',
  },
  shiftForRight: {
    float: 'right',
    marginRight: "10%"
  },
  shiftForLeft: {
    marginLeft: "10%"
  },
  holdCard: {
    margin: '0 2px'
  },
  halfVisible : {
    opacity: '.5',
  },
  fallingCards : {
    animation: 'falling 1s forwards ease-in-out'
  }
}))

const HoleCards = React.memo(({cards, isRight, isFolded, status, tableStatus, winningCards, winningPositions, position, currentUserPosition}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = useStyles()
  const hasUserWon = winningPositions && winningPositions.includes(position)

  const [isFalling, setIsFalling] = useState(false)

  useEffect(() => {
    subscribeBefore(`hole-cards-${position}`, (action) => {
      if (action.type === EventsTableEventTypeEnum.HoleCards) {
        if (position === currentUserPosition) {
          setIsFalling(true)
          setTimeout(() => setIsFalling(false), 1000)
        }
      }
    })
    return () => {
      unsubscribe(`hole-cards-${position}`)
    }
  }, [])

  function isOneOfTheBestCard(card) {
    if (winningCards) {
      return (winningCards.indexOf(card) !== -1)
    }
  }

  const isHalfVisible = () => isFolded || status === ModelPlayerStatusEnum.Ready

  const isGrey = () => status === ModelPlayerStatusEnum.SittingOut

  const timeToOpen = isFalling ? 500 : (tableStatus === ModelTableStatusEnum.ShowDown ? 1 : 0)
  return (
    <div className={`${classes.root} ${isRight?classes.shiftForRight:classes.shiftForLeft} ${isHalfVisible()?classes.halfVisible:""} ${isFalling?classes.fallingCards:""} ${isGrey()?"grey-scale":""}`}>
      {
        cards.map((card, idx) => {
          return (
            <div className={classes.holdCard} key={card + idx}>
              <Card cardStr={card}
                    size={isMobile ? 'normal-big' : 'normal'}
                    cardFace={timeToOpen ? 'down' : 'up'}
                    timeToOpen={timeToOpen}
                    isMoveUp={hasUserWon && isOneOfTheBestCard(card)}
                    isShadow={hasUserWon && !isOneOfTheBestCard(card)}
              />
            </div>
          )
        })
      }
    </div>
  )
})

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    currentUserPosition: tableWS.currentUserPosition,
    winningPositions: tableWS.winningPositions, winningCards: tableWS.winningCards
  };
};

export default connect(mapStateToProps)(HoleCards)