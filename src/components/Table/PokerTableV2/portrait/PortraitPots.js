import React, {useEffect, useState} from "react";
import PotChips from "../pot/PotChips";
import {makeStyles} from "@material-ui/core/styles";
import {subscribeAfter, unsubscribe} from "../../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {getPortraitPotDistance, getPortraitUserPlateRotateAngle} from "./util";
import {toRadians} from "../../util";
import {Spring, animated} from "react-spring";

const useStyles = makeStyles(() => ({
  pots: {
    display: "flex",
    justifyContent: "center"
  },
  pot: {
    marginLeft: "3vw",
    marginRight: "3vw"
  },
  movingPot: {
    position: 'absolute',
  },
}))

const PortraitPots = ({pots}) => {
  const classes = useStyles()

  const [movingPotIdx, setMovingPotIdx] = useState(-1)

  useEffect(() => {
    subscribeAfter("portrait-poker-table-pots", (action) => {
      if (action.type === EventsTableEventTypeEnum.Winners) {
        setTimeout(() => startMovingPots(0), 500)
      }

      if (action.type === EventsTableEventTypeEnum.Reset || action.type === EventsTableEventTypeEnum.InitState) {
        setMovingPotIdx(-1)
      }
    })

    return () => {
      unsubscribe("portrait-poker-table-pots")
    }
  }, [])

  function startMovingPots() {
    setMovingPotIdx(0)
  }

  if (!pots) {
    return <div/>
  }

  // One table pot can be split by multiple players
  const transitionPot = () => {
    if (movingPotIdx < 0) {
      return <div/>
    }
    const movingPot = pots[movingPotIdx];
    if (movingPot && movingPot.winnerPositions) {
      return movingPot.winnerPositions.map(winnerPosition => {
        const winnerAngle = getPortraitUserPlateRotateAngle(6, winnerPosition)
        const potDistance = getPortraitPotDistance(6, winnerPosition)
        // https://math.stackexchange.com/a/143946
        const x = potDistance * Math.cos(toRadians(winnerAngle))
        const y = potDistance * Math.sin(toRadians(winnerAngle))
        const chips = Math.floor(movingPot.chips/movingPot.winnerPositions.length);
        return (
          <Spring
            native
            key={`moving-${movingPotIdx}-${winnerPosition}`}
            from={{transform: `translate3d(0vw, 0vw, 0)`}}
            to={{transform: `translate3d(${x}vw, ${y}vw, 0)`}}>
            {props => <animated.div style={props} className={classes.movingPot}><PotChips widthVW={8} chips={chips}/></animated.div>}
          </Spring>
        )
      })
    }
  }

  const toPotsDiv = (pots, startIdx) => {
    return pots.map((p, idx) => <PotChips key={`${startIdx+idx}`} widthVW={8} chips={p.chips}/>)
  }

  const stillPots = () => toPotsDiv(pots.slice(movingPotIdx + 1), movingPotIdx+1)

  return (
    <div className={classes.pots}>
      {transitionPot()}
      {stillPots()}
    </div>
  )

}

export default PortraitPots