import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '5%',
    width: "58%",
    height: '13%',
    border: '0.1vw solid white',
    borderRadius: '5px',
    backgroundColor: 'black',
  },
  shiftForRight: {
    left: '36%'
  },
  shiftForLeft: {
    left: '6%'
  },
  bar: {
    height: '100%',
    borderRadius: '5px',
  }
}))

const TimeoutBarPlate = React.memo(({isDeciding, timeoutAt, isRight}) => {
  const classes = useStyles()

  if (!timeoutAt || !isDeciding) {
    return <div/>
  }

  const playerTimeoutAt = timeoutAt - Date.now()
  return (
    <div className={`${classes.root} ${isRight?classes.shiftForRight:classes.shiftForLeft}`} >
      <div className={classes.bar} style={{
             animation: `fill ${playerTimeoutAt}ms linear 0s 1 normal forwards,
               blinker 0.5s linear ${playerTimeoutAt * 3 / 4}ms infinite
               `
           }}/>
    </div>
  )
})

export default TimeoutBarPlate
