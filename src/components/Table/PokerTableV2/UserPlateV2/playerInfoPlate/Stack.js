import React, {useEffect, useState} from "react";
import {adaptChipsToBB} from "../../../util";
import {
  EventsTableEventTypeEnum,
  ModelPlayerLastGameActionEnum,
  ModelPlayerShowDownActionEnum,
  ModelPlayerStatusEnum
} from "@pokergloss/table-client-typescript";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {setOpenBuyIn} from "../../../../../redux/actions/table";
import {subscribeAfter, unsubscribe} from "../../../../../redux/redux-subscribe-action";

const useStyles = makeStyles(() => ({
  stack: {
    textAlign: "center"
  },
}))

const Stack = ({player, position, shiftCSS, currentUserPosition, isChipsInBB, bigBlind, setOpenBuyIn}) => {
  const classes = useStyles()

  useEffect(() => {
    return () => {
      unsubscribe(`stack-${position}`)
    }
  }, [])

  subscribeAfter(`stack-${position}`, (action) => {
    if (action.type === EventsTableEventTypeEnum.PlayerAction || action.type === EventsTableEventTypeEnum.ShowDown) {
      const actionPosition = action.payload.table.seats[0].player.position
      if (actionPosition === player.position) {
        setActionMsgType(action.type)
        setTimeout(() => setActionMsgType('stack'), 1000)
      }
    }
  })

  const [actionMsgType, setActionMsgType] = useState('stack')

  const [sittingOutMsgType, setSittingOutMsgType] = useState('sittingOut');

  if (currentUserPosition === player.position && player.stack === 0 &&
    (player.status === ModelPlayerStatusEnum.SittingOut || player.status === ModelPlayerStatusEnum.Sitting)) {
    setOpenBuyIn(true)
  }

  const textDiv = (color, text) => {
    return <div className={classes.stack} style={Object.assign({}, shiftCSS, {color})}>{text}</div>
  }

  const stackDiv = () => {
    return textDiv("#2ee703", isChipsInBB ? adaptChipsToBB(player.stack, bigBlind) : player.stack)
  }

  switch (player.status) {
    case ModelPlayerStatusEnum.SittingOut: {
      switch (sittingOutMsgType) {
        case 'playerStack':
          setTimeout(() => setSittingOutMsgType('sittingOut'), 3000)
          return textDiv('grey', 'Sitting out')
        case 'sittingOut':
          setTimeout(() => setSittingOutMsgType('playerStack'), 3000)
          return stackDiv()
        default: return stackDiv()
      }
    }
    case ModelPlayerStatusEnum.Sitting: {
      return textDiv("grey", "Reserved")
    }
    case ModelPlayerStatusEnum.Playing: {
      switch (actionMsgType) {
        case EventsTableEventTypeEnum.ShowDown:
          switch (player.showDownAction) {
            case ModelPlayerShowDownActionEnum.Show:
              return textDiv('yellow', "Show")
            case "showLeft":
              return textDiv('#15cfe0', "Show Left")
            case "showRight":
              return textDiv('#15cfe0', "Show Right")
            case ModelPlayerShowDownActionEnum.Muck:
              return textDiv('blueviolet', 'Muck')
            default: return stackDiv()
          }
        case EventsTableEventTypeEnum.PlayerAction:
          let color
          let text
          switch (player.lastGameAction) {
            case ModelPlayerLastGameActionEnum.Raise:
              color = 'red'
              text = 'Raise'
              break
            case ModelPlayerLastGameActionEnum.Bet:
              color = 'red'
              text = 'Bet'
              break
            case ModelPlayerLastGameActionEnum.AllIn:
              color = 'red'
              text = 'AllIn'
              break
            case ModelPlayerLastGameActionEnum.Call:
              color = 'yellow'
              text = 'Call'
              break
            case ModelPlayerLastGameActionEnum.Check:
              color = 'deepskyblue'
              text = 'Check'
              break
            case ModelPlayerLastGameActionEnum.Fold:
              color = 'gray'
              text = 'Fold'
              break
            default: return stackDiv()
          }
          return textDiv(color, text)

        case 'stack': return stackDiv()

      }
      return stackDiv()
    }
    default: return stackDiv();
  }
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind,
    currentUserPosition: tableWS.currentUserPosition
  };
};

export default connect(mapStateToProps, {setOpenBuyIn})(Stack)
