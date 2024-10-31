import React, {useEffect, useRef} from "react";
import Chips from "../Chips";
import {Spring, animated} from "react-spring";
import {
  getBetDistance, getBetRotateAngle,
  getBetRotateAngleAdjusted,
  getUserPlateDistance
} from "../../../util/tableSeatsMath";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {adaptChipsToBB} from "../../util";

const useStyles = makeStyles(() => ({
  rootBet: {
    position: 'absolute',
  },
  chipsWithLabel: {
    display: 'flex',
  },
  chipsSum: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    fontFamily: '"Times New Roman", Times, serif',
    whiteSpace: 'nowrap',
    color: 'white',
    lineHeight: 'normal',
    borderRadius: '50%/60%',
    position: 'absolute',
    padding: '0 0.7vw',
    fontSize: '1.3vw'
  },
  chips: {
    position: 'absolute',
    top: '0'
  },
  transformToCenter : {
    position: 'absolute',
    transform: 'translate(-50%, -50%)'
  },
}))

const Bet = ({tableSize, position, bet, isRight, height, width, isChipsInBB, bigBlind}) => {
  const classes = useStyles()
  const prevBet = usePrevious(bet)

  const angle = React.useMemo(() => getBetRotateAngleAdjusted(tableSize, position), [tableSize, position])
  const angleToCenter = React.useMemo(() => getBetRotateAngle(tableSize, position), [tableSize, position])
  const betDistance = React.useMemo(() => getBetDistance(), [angle])
  const userPlateDistance = React.useMemo(() => getUserPlateDistance(angle), [angle])

  const sideShiftCSS = () => {
    if (isRight) {
      return {left: `${height/2}vw`, top: `${height/2}vw`}
    } else {
      return {left: `${width-height/2}vw`, top: `${height/2}vw`}
    }
  }

  const sideShiftForLabelCSS = () => {
    return isRight ? {right: "1vw"} : {left: '1vw'}
  }

  const getPlayerBet = (chips) => {
    let label = <span className={classes.chipsSum} style={Object.assign(sideShiftForLabelCSS(), {zIndex: chips + 1})}>{isChipsInBB ? adaptChipsToBB(chips, bigBlind) : chips}</span>;
    return (
      <div className={`${classes.chipsWithLabel}`}>
        {isRight && label}
        <Chips className={`${classes.chips} ${classes.transformToCenter}`} key={`bet-chips-${position}-${chips}`} chips={chips} dense={true}/>
        {!isRight && label}
      </div>
    );
  }

  if (!bet && !prevBet) {
    return <div/>
  }

  if (!bet) {
    if (prevBet > 0) {
      // bet = Math.floor(1000 * Math.random())
      const playerBettingChips = getPlayerBet(prevBet)
      return (
        <div className={classes.rootBet} style={sideShiftCSS()}>
          <Spring
            native
            from={{ opacity: 1, transform: `rotate(${angle}deg) translate(${betDistance}vw) rotate(-${angle}deg)`}}
            to={{ opacity: 0, transform: `rotate(${angleToCenter}deg) translate(${userPlateDistance}vw) rotate(-${angleToCenter}deg)`}}>
            {props => <animated.div style={props}>{playerBettingChips}</animated.div>}
          </Spring>
        </div>
      )
    }

    return <div/>
  }

  const endPoint = {opacity: 1, transform: `rotate(${angle}deg) translate(${betDistance}vw) rotate(-${angle}deg)`}
  const playerBettingChips = getPlayerBet(bet)
  if (prevBet === 0) {
    return (
      <div className={classes.rootBet} style={sideShiftCSS()}>
        <Spring
          native
          key={prevBet === 0 ? bet : "bet-key"}
          from={{opacity: 0.5, transform: "rotate(0deg) translate(0vw) rotate(0deg)"}}
          to={endPoint}>
          {props => <animated.div style={props}>{playerBettingChips}</animated.div>}
        </Spring>
      </div>
    )
  }

  return (
    <div className={classes.rootBet} style={Object.assign(endPoint, sideShiftCSS())}>
      {playerBettingChips}
    </div>
  )

  // https://stackoverflow.com/a/53446665/10160865
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
}

const mapStateToProps = state => {
  const { tableWS } = state
  return {
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind
  };
};

export default connect(mapStateToProps)(Bet)