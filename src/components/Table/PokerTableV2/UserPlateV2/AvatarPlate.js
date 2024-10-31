import React from "react";
import {avatarUrlOrDefault} from "../../../../auth";
import {makeStyles} from "@material-ui/core/styles";
import TextShadow from "../../../UI/TextShadow/TextShadow";
import BankBalance from "./BankBalance";
import {connect} from "react-redux";

import Vip from "../../../UI/Vip";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute'
  },
  avatar: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: '50%',
    zIndex: 1,
  },
  deciding: {
    border: '0.3vw solid transparent',
  },
  decidingHighlight: {
    position: "absolute",
    zIndex: "-2",
    content: "''",
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    borderBottom: "0 solid #ffffff05",
    boxShadow: "0 1vw 2vw 2vw rgba(0, 200, 255, 0.25)",
  },
  notDeciding: {
    backgroundColor: 'black',
  },
  defaultBorder: {
    border: '0.3vw double rgb(77, 83, 90)',
  },
  goldenBorder: {
    border: '1px solid #8c8e07',
  },
  winnerHighlight: {
    position: "absolute",
    zIndex: "-2",
    content: "''",
    width: "100%",
    height: "100%",
    borderRadius: "100%",
    borderBottom: "0 solid #ffffff05",
    boxShadow: "0 1vw 2vw 2vw rgba(179, 0, 255, 0.25)"
  },
  blackBackground: {
    height: '90%',
    width: '90%',
    margin: '5%',
    borderRadius: '50%',
    background: 'black',
    zIndex: 0,
    position: 'absolute',
  },
  level: {
    position: 'absolute',
    bottom: 0,
    zIndex: 3,
    color: '#4ce015',
    fontWeight: 'bold',
    lineHeight: '50%',
  },
  bankBalance: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 3,
    color: '#00c1ff',
    fontWeight: 'bold',
    lineHeight: '70%',
  },
  vipIcon: {
    position: 'absolute',
    zIndex: 1,
    width: '70%',
    top: '-10%'
  }
}))

const AvatarPlate = ({isRight, player, height, width, winningPositions, className}) => {
  const classes = useStyles();

  const rootCSS = () => {
    let css = {height: `${height}vw`, width: `${height}vw`}
    if (!isRight) {
      css.left = `${width-height}vw`
    }
    return css
  }

  const isVip = player.marketItemCoins > 0
  const isTopPlayer = () => player.bankRank > 0 && player.bankRank <= 10

  const isWinner = winningPositions && winningPositions.includes(player.position)
  const isDeciding = !!player.isDeciding

  return (
    <div style={rootCSS()} className={`${classes.root} ${className}`}>
      <img className={`${classes.avatar} ${isDeciding ? classes.deciding : classes.notDeciding} ${isTopPlayer()?classes.goldenBorder:classes.defaultBorder}`} src={avatarUrlOrDefault(player.picture)} alt="..."/>
      {isDeciding && <div className={"deciding-circle"}/>}
      {isDeciding && <div className={classes.decidingHighlight}/>}
      {isWinner && <div className={classes.winnerHighlight}/>}

      <div className={classes.blackBackground}/>
      {
        player.level !== undefined && player.level !== null &&
        <TextShadow style={{fontSize: `${height/3}vw`}} className={classes.level}>{player.level}</TextShadow>
      }
      {
        player.bankBalance !== undefined && player.bankBalance !== null &&
        <BankBalance fontSize={`${height/5 }vw`} className={classes.bankBalance}
                     bankBalance={player.bankBalance}/>
      }
      {isVip && <div className={classes.vipIcon} style={{right: isRight?"-20%":"55%"}}><Vip/></div>}
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    winningPositions: tableWS.winningPositions
  };
};

export default connect(mapStateToProps)(AvatarPlate)