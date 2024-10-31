import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {avatarUrlOrDefault} from "../../../../auth";
import {connect} from "react-redux";
import Stack from "../UserPlateV2/playerInfoPlate/Stack";
import Card from "../../Card/Card";
import PortraitBet from "./PortraitBet";

const useStyles = makeStyles(() => ({
  rootBorder: {
    borderColor: "rgb(81,238,102)",
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: "10%",
  },
  avatar: {
    width: "70%",
    height: "65%",
    marginTop: "2%",
    marginLeft: "15%",
    position: "relative"
  },
  avatarImg: {
    position: "absolute",
    borderRadius: '50%',
    width: "96%",
    left: "2%",
    top: "2%"
  },
  deciding: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    animation: "spin 6s linear infinite",
    backgroundColor: "white",
    border: "2.5px dashed black"
  },
  notDeciding: {
    backgroundColor: 'black',
  },
  decidingHighlight: {
    position: "relative",
    zIndex: "-2",
    content: "''",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    borderBottom: "0 solid #ffffff05",
    boxShadow: "0 1vw 2vw 2vw rgba(0, 200, 255, 0.25)",
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
  info: {
    display: "flex",
    justifyContent: "space-between"
  },
  userInfo: {
    minWidth: "50%"
  },
  username: {
    textAlign: "center",
    color: "white"
  },
  holeCards: {
    display: "flex",
    minWidth: "50%"
  },
  card: {
    width: "20%",
    height: "25%"
  },
}))

const PortraitPlate = ({player, winningPositions, size}) => {
  const classes = useStyles()

  function avatar() {
    const isDeciding = !!player.isDeciding
    return <div className={classes.avatar}>
      <div className={`${isDeciding ? classes.deciding : classes.notDeciding}`}/>
      <img className={`${classes.avatarImg}`}
           src={avatarUrlOrDefault(player.picture)} alt="..."/>
      {/*{isDeciding && <div className={"deciding-circle"}/>}*/}
      {/*{isWinner && <div className={classes.winnerHighlight}/>}*/}
    </div>;
  }

  const sizeCSS = () => {
    const medium = {width: "36vw", height: "18vh"};
    switch (size) {
      case "tiny": return {width: "28vw", height: "14vh"}
      case "small": return {width: "32vw", height: "16vh"}
      case "medium": return medium
      case "large": return {width: "40vw", height: "20vh"}
      default: return medium
    }
  }
  const fontSize = () => {
    return {fontSize: (0.8 + 0.1*sizeToNum()) + "rem"}
  }
  const sizeToNum = () => {
    switch (size) {
      case "tiny": return 0
      case "small": return 1
      case "medium": return 2
      case "large": return 3
      default: return 2
    }
  }
  if (!player) {
    return <div/>
  }

  const holeCards = () => {
    const isPresent = player.cards && player.cards.length > 0
    return (
      <div className={classes.holeCards}>
        {isPresent && <Card widthVW={6 + sizeToNum()} cardStr={player.cards[0]} cardFace={"up"}/>}
        {isPresent && <Card widthVW={6 + sizeToNum()} cardStr={player.cards[1]} cardFace={"up"}/>}
      </div>
    )
  }

  return (
    <div style={sizeCSS()} className={classes.rootBorder}>
      {avatar()}
      <div className={classes.info}>
        {holeCards()}
        <div className={classes.userInfo}>
          <div style={fontSize()} className={classes.username}>{player.username}</div>
          <Stack player={player} position={player.position} shiftCSS={fontSize()}/>
        </div>
      </div>
      <PortraitBet bet={player.totalRoundBet}/>
    </div>
  );
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    winningPositions: tableWS.winningPositions
  };
};


export default connect(mapStateToProps)(PortraitPlate)
