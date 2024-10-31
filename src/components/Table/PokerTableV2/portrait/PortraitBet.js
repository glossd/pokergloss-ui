import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useRef} from "react";
import Chips from "../Chips";
import {Spring, animated} from "react-spring";

const useStyles = makeStyles(() => ({
  bet: {
    display: "flex",
    paddingLeft: "30%"
  },
  betLabel: {
    backgroundColor: 'rgb(64 64 64)',
    fontFamily: '"Times New Roman", Times, serif',
    whiteSpace: 'nowrap',
    color: 'white',
    lineHeight: 'normal',
    borderRadius: '50%/60%',
    position: 'absolute',
    padding: '0 0.7vw',
    fontSize: '4.2vw',
    marginLeft: "8vw",
    marginTop: "1vw"
  }
}))

const PortraitBet = ({bet}) => {
  const classes = useStyles()
  const prevBet = usePrevious(bet)

  function betDiv() {
    return (
      <div className={classes.bet}>
        <Chips chips={bet} dense={true} widthVW={8}/>
        <div className={classes.betLabel}>{bet}</div>
      </div>
    );
  }

  if (!prevBet && bet > 0) {
    return (
      <Spring
        native
        from={{opacity: 0.5, transform: "translateY(-50px)"}}
        to={{opacity: 1, transform: "translateY(0px)"}}>
        {props => <animated.div style={props}>{betDiv()}</animated.div>}
      </Spring>
      )
  }

  if (!bet) {
    return <div/>;
  }

  return betDiv()
}

// https://stackoverflow.com/a/53446665/10160865
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default PortraitBet