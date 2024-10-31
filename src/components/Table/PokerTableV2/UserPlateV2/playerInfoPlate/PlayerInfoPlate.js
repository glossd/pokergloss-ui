import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Stack from "./Stack";


const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    width: '100%',
    borderRadius: '15%/ 50%'
  },
  defaultBackground: {
    backgroundColor: 'black',
    border: 'double #3c413f'
  },
  goldenBackground: {
    background: "radial-gradient(ellipse farthest-corner at right bottom, #FEDB37 0%, #FDB931 8%, #9f7928 30%, #8A6E2F 40%, transparent 80%),\n" +
      "                radial-gradient(ellipse farthest-corner at left top, #FFFFFF 0%, #FFFFAC 8%, #D1B464 25%, #5d4a1f 62.5%, #5d4a1f 100%)",
    border: 'solid 1px #8c8e07'
  },
  username: {
    textAlign: "center",
    color: "white",
    fontFamily: "“Helvetica Neue”, Helvetica, Arial, sans-serif",
    marginTop: '1%',
  },
  usernameBlack: {
    color: "black",
  },
  usernamePurple: {
    color: "#aa2dff",
  },
  topPlayerStampContainer: {
    position: 'absolute',
    width: '100%',
    top: '40%',
  },
  topPlayerStamp: {
    position: 'absolute',
    transform: 'rotate(30deg)',
    opacity: 0.3,
    textAlign: "center",
    fontWeight: '1000',
    fontFamily: 'Impact, serif',
    whiteSpace: 'nowrap'
  }
}))

const PlayerInfoPlate = ({isRight, player, position, height, className}) => {
  const classes = useStyles()

  const sideShiftCSS = () => {
    const shift = height*5/6 + "vw"
    if (isRight) {
      return {marginLeft: shift}
    } else {
      return {marginRight: shift}
    }
  }

  const fontSizeCSS = (coef) => ({fontSize: height/4.5*coef + "vw"})

  const CSS = (coef=1) => Object.assign(sideShiftCSS(), fontSizeCSS(coef))

  const isVip2Level = player.marketItemCoins > 1
  const isTopPlayer = () => player.bankRank > 0 && player.bankRank <= 10

  return (
    <div className={`${classes.root} ${className} ${isTopPlayer()?classes.goldenBackground:classes.defaultBackground}`}>
      {
        isTopPlayer() &&
        <div className={classes.topPlayerStampContainer}>
          <div className={classes.topPlayerStamp}  style={Object.assign(isRight ?{left: '75%', transform:'rotate(-30deg)'}:{transform:'rotate(30deg)'}, {fontSize: height/3.8 + "vw"})}>
            TOP {player.bankRank}
          </div>
        </div>
      }
      <div className={`${classes.username} ${isVip2Level?classes.usernamePurple:isTopPlayer()?classes.usernameBlack:''}`}
           style={CSS(isVip2Level?1.1:1)}>{player.username}</div>
      <Stack player={player} position={position} shiftCSS={CSS()}/>
    </div>
  )
}

export default PlayerInfoPlate
