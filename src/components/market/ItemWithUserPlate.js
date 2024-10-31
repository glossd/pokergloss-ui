import React, {useEffect, useState} from "react";
import {getCurrentUser} from "../../auth/Firebase";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {backendError} from "../../backend/error";
import {avatarUrlOrDefault} from "../../auth";
import TextShadow from "../UI/TextShadow/TextShadow";
import BankBalance from "../Table/PokerTableV2/UserPlateV2/BankBalance";
import {itemIcon} from "./itemStore";

const height = 75
const width = 210

const styles = makeStyles(() => ({
  root: {
    height: `${height}px`,
    width: `${width}px`,
    margin: '15px'
  },
  avatarContainer: {
    width: `${height}px`,
    height: `${height}px`
  },
  avatar: {
    borderRadius: '50%',
    zIndex: 2,
    height: '100%',
    backgroundColor: 'black',
    border: 'double rgb(77, 83, 90)',
    position: 'relative'
  },
  level: {
    position: 'relative',
    bottom: '30%',
    left: '5%',
    zIndex: 4,
    color: '#4ce015',
    fontWeight: 'bold',
    fontSize: `${height / 3}px`
  },
  bankBalance: {
    position: 'relative',
    bottom: '70%',
    left: '50%',
    zIndex: 4,
    color: '#00c1ff',
    fontWeight: 'bold',
    fontSize: `${height / 5}px`
  },
  stackPlate: {
    position: 'relative',
    height: '80%',
    borderRadius: '15%/ 50%',
    backgroundColor: 'black',
    border: 'double #3c413f',
    bottom: '90%',
    zIndex: 1,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontFamily: "“Helvetica Neue”, Helvetica, Arial, sans-serif",
    marginTop: '1%',
    fontSize: `${height / 4.5}px`,
    marginLeft: `${height * 5 / 6}px`,
  },
  item: {
    position: 'relative',
    width: `${width / 4}px`,
    height: `${width / 4}px`,
    zIndex: 3,
    bottom: '140%',
    left: '30%',
    display: 'flex',
    justifyContent: 'center',
  }
}))

const ItemWithUserPlate = ({balance, exp, marketItemId}) => {
  const classes = styles()
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setPlayer({
          username: user.displayName,
          picture: user.photoURL,
          userId: user.uid,
          level: exp.level,
          bankBalance: balance,
          stack: 250,
        })
      })
      .catch(backendError)
  }, [])

  return (
    <div>
      {player && player.bankBalance &&
      <div className={classes.root}>

        <div className={classes.avatarContainer}>
          <img className={classes.avatar} src={avatarUrlOrDefault(player.picture)} alt="..."/>
          <TextShadow className={classes.level}>{player.level}</TextShadow>
          <BankBalance className={classes.bankBalance} bankBalance={player.bankBalance.chips}/>
        </div>

        <div className={classes.stackPlate}>
          <div className={classes.text} style={{color: "white"}}>{player.username}</div>
          <div className={classes.text} style={{color: "green"}}>{player.stack}</div>
        </div>

        <div className={classes.item}>
          {itemIcon(marketItemId)}
        </div>
      </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const {news} = state
  return {
    balance: news.balance,
    exp: news.exp,
  };
};

export default connect(mapStateToProps)(ItemWithUserPlate)