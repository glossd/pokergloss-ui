import React, {useState} from "react";
import {getPotDistance, getUserPlateRotateAngle} from "../../../util/tableSeatsMath";
import {Spring, animated} from 'react-spring';
import {subscribeAfter} from "../../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";
import PotUserChips from "./PotUserChips";
import PotChips from "./PotChips";
import {makeStyles} from "@material-ui/core/styles";
import {toRadians} from "../../util";

const useStyles = makeStyles(() => ({
  potsRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  potMargin: {
    margin: '2vw 0 0.5vw 0.5vw'
  },
  movingPot: {
    position: 'absolute',
    top: '0.5vw'
  },
  userChips: {
    position: 'absolute',
    top: '0.5vw'
  }
}))

const Pots = ({tablePots, tableSize}) => {
  const classes = useStyles()
  const [movingPotIdx, setMovingPotIdx] = useState(-1)

  subscribeAfter("poker-table-pots", (action) => {
    if (action.type === EventsTableEventTypeEnum.Winners) {
      setTimeout(() => startMovingPots(0), 500)
    }

    if (action.type === EventsTableEventTypeEnum.Reset || action.type === EventsTableEventTypeEnum.InitState) {
      setMovingPotIdx(-1)
    }
  })

  function startMovingPots(fromIndex) {
    if (fromIndex >= getPots().length) {
      setMovingPotIdx(getPots().length)
      return
    }
    setMovingPotIdx(fromIndex)

    if (fromIndex+1 <= getPots().length) {
      setTimeout(() => startMovingPots(fromIndex+1), 750)
    }
  }

  function getPots() {
    // return [{chips: 23}, {chips: 889}, {chips: 3999900}]
    return !!tablePots ? tablePots : []
  }

  function getMovingPot() {
    return getPots()[movingPotIdx]
  }

  // One table pot can be split by multiple players
  function transitionPot(movingPot, potIdx) {
    if (movingPot && movingPot.winnerPositions) {
      return movingPot.winnerPositions.map(winnerPosition => {
        const winnerAngle = getUserPlateRotateAngle(tableSize, winnerPosition)
        const potDistance = getPotDistance(winnerAngle)
        // https://math.stackexchange.com/a/143946
        const x = potDistance * Math.cos(toRadians(winnerAngle))
        const y = potDistance * Math.sin(toRadians(winnerAngle))
        const chips = Math.floor(movingPot.chips/movingPot.winnerPositions.length);
        return (
          <Spring
            native
            key={`moving-${potIdx}-${winnerPosition}`}
            from={{transform: `translate3d(0vw, 0vw, 0)`}}
            to={{transform: `translate3d(${x}vw, ${y}vw, 0)`}}>
            {props => <animated.div style={props} className={classes.movingPot}><PotChips chips={chips}/></animated.div>}
          </Spring>
        )
      })
    }
  }

  const toDivStillPots = (pots, startIdx) => {
    return pots.map((p, idx) => <PotChips key={`${startIdx+idx}`} className={classes.potMargin} chips={p.chips}/>)
  }

  if (movingPotIdx === -1) {
    return (
      <div className={classes.potsRoot}>
        {toDivStillPots(getPots(), 0)}
      </div>
    )
  }

  const userWonChips = () => {
    const movedPots =  getPots().slice(0, movingPotIdx)
    const m = new Map()
    movedPots.forEach(p => {
      if (!p.winnerPositions || p.winnerPositions.length === 0) {
        return
      }
      const userPotWin = Math.floor(p.chips / p.winnerPositions.length)
      p.winnerPositions.forEach(pos => {
        let userWinChips = m.get(pos)
        if (userWinChips) {
          m.set(pos, userWinChips + userPotWin)
        } else {
          m.set(pos, userPotWin)
        }
      })
    })
    return m
  }

  const stillPots = () => {
    return toDivStillPots(getPots().slice(movingPotIdx + 1), movingPotIdx)
  }

  return (
    <div className={classes.potsRoot}>
      {Array.from(userWonChips(), ([position, chips]) => (
        <PotUserChips key={`user-win-${position}`} position={position} chips={chips} className={classes.userChips}/>
      ))}
      {transitionPot(getMovingPot(), movingPotIdx)}
      {stillPots()}
    </div>
  );
}

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  return {
    tablePots: table.pots,
    tableSize: table.size,
  };
};

export default connect(mapStateToProps)(Pots)

