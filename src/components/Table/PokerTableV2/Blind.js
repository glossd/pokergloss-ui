import React, {useEffect, useRef} from "react";
import {ModelPlayerBlindEnum} from "@pokergloss/table-client-typescript";
import Dealer from "./blinds/Dealer";
import SmallBlind from "./blinds/SmallBlind";
import BigBlind from "./blinds/BigBlind";
import {getBlindDistanceV2, getUserPlateRotateAngle, toCoordinates} from "../../util/tableSeatsMath";
import {animated, Spring} from "react-spring";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  rootBlind: {
    position: "absolute",
    width: "1.5vw",
    height: "1.5vw",
    transform: 'translate(-50%, -50%)'
  },
}))

const Blind = React.memo(({tableSize, position, blind}) => {
  const classes = useStyles()
  const prevPosition = usePrevious(position)
  if (position === -1) {
    return <div/>
  }

  const angle = getUserPlateRotateAngle(tableSize, position);
  const distance = getBlindDistanceV2(angle)
  const coords = toCoordinates(angle, distance)

  let prevAngle = angle
  let prevDistance = distance
  if (prevPosition >= 0) {
    prevAngle = getUserPlateRotateAngle(tableSize, prevPosition);
    prevDistance = getBlindDistanceV2(prevAngle)
    if (prevAngle > angle) {
      prevAngle -= 360
    }
  } else {
    if (prevPosition === -1) {
      prevAngle = 270
      prevDistance = getBlindDistanceV2(prevAngle)
    }
  }
  const prevCoords = toCoordinates(prevAngle, prevDistance)


  let blindJSX
  switch (blind) {
    case ModelPlayerBlindEnum.Dealer:
    case ModelPlayerBlindEnum.DealerSmallBlind:
      blindJSX = <Dealer/>
      break
    case ModelPlayerBlindEnum.SmallBlind:
      blindJSX = <SmallBlind/>
      break
    case ModelPlayerBlindEnum.BigBlind:
      blindJSX = <BigBlind/>
      break
  }



  return (
    <Spring
      native
      key={`blind-${blind}-${position}`}
      config={{friction: 40}}
      from={{transform: `translate3d(${prevCoords.x}vw, ${prevCoords.y}vw, 0)`}}
      to={{transform: `translate3d(${coords.x}vw, ${coords.y}vw, 0)`}}>
      {props => <animated.div style={props}><div className={classes.rootBlind}>{blindJSX}</div></animated.div>}
    </Spring>
  );

  // https://stackoverflow.com/a/53446665/10160865
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
})

export default Blind
