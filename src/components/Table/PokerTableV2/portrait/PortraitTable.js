import React, {useEffect} from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import PortraitPlate from "./PortraitPlate";
import {getCurrentUserPlayer} from "../../util";
import {newEvent} from "../../../../redux/actions";
import {blinds, bot, getInitTable, holeCards, newBettingRound, user} from "../../../tutorial/events";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {setCurrentUserPosition} from "../../../../redux/actions/table";
import Card from "../../Card/Card";
import PotChips from "../pot/PotChips";
import PortraitActions from "./PortraitActions";
import Sounds from "../Sounds";
import PortraitPots from "./PortraitPots";

const useStyles = makeStyles(() => ({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  tableBorder: {
    position: "absolute",
    top: "5%",
    left: "5%",
    width: "90%",
    height: "90%",
    borderColor: "rgba(81, 203, 238, 1)",
    borderWidth: "5px",
    borderStyle: "solid",
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    boxShadow: "0 0 10px rgba(81, 203, 238, 1)",
    opacity: "0.5",
    zIndex: 0,
  },
  currentUserRec: {
    height: "30%",
    width: "100%",
    zIndex: 1,
  },
  nearUsersRec: {
    height: "20%",
    width: "100%",
    zIndex: 1,
  },
  tableCenterRec: {
    height: "17.5%",
    width: "100%",
    zIndex: 2,
  },
  communityCards: {
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "5%",
    marginTop: "5%"
  },
  communityCard: {
    marginLeft: "2px",
    marginRight: "2px",
  },
  preLastRec: {
    height: "17.5%",
    width: "100%",
    zIndex: 1,
  },
  lastRec: {
    height: "15%",
    width: "100%",
    zIndex: 1,
  },
  positionerForOne: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  positionerForTwo: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
}))

const PortraitTable = ({table, currentUserPosition, newEvent, setCurrentUserPosition}) => {
  const classes = useStyles()

  const positioner = (...content) => {
    if (content.length === 1) {
      return <div className={classes.positionerForOne}>{[...content]}</div>
    }
    if (content.length === 2) {
      return <div className={classes.positionerForTwo}>{[...content]}</div>
    }
  }

  // useEffect(() => {
  //   let initTable = getInitTable();
  //   initTable.seats = [
  //     bot(0, 100),
  //     user(234),
  //     bot(2, 94),
  //     bot(3, 86),
  //     bot(4, 45),
  //     bot(5, 86),
  //   ]
  //   newEvent({type: EventsTableEventTypeEnum.InitState, payload: {table: initTable}})
  //   setCurrentUserPosition(1)
  //   setTimeout(() => newEvent({type: EventsTableEventTypeEnum.HoleCards, payload: {table: holeCards(["As", "Kh"])}}), 500)
  //   setTimeout(() => newEvent({type: EventsTableEventTypeEnum.Blinds, payload: {table:  blinds()}}), 1000)
  //   const flopCards = ["As", "Ks", "Qs"]
  //   setTimeout(() => newEvent({type: EventsTableEventTypeEnum.NewBettingRound, payload: newBettingRound(flopCards, flopCards, 12)}), 1500)
  //   setTimeout(() => newEvent({type: EventsTableEventTypeEnum.NewBettingRound, payload: {table: {pots: [{chips: 12}, {chips: 34}]}}}), 2000)
  // }, [])

  return (
    <div className={classes.root}>
      <PortraitActions/>
      <div className={classes.lastRec}>
        {positioner(<PortraitPlate key={4} size={"tiny"} player={getCurrentUserPlayer(table, 4)}/>)}
      </div>
      <div className={classes.preLastRec}>
        {positioner(<PortraitPlate key={3} size={"small"} player={getCurrentUserPlayer(table, 3)}/>, <PortraitPlate key={5} size={"small"} player={getCurrentUserPlayer(table, 5)}/>)}
      </div>
      <div className={classes.tableCenterRec}>
        {
          table.communityCards &&
          <div className={classes.communityCards}>
            {table.communityCards.map(c => <div className={classes.communityCard}><Card key={c} cardStr={c} widthVW={17} cardFace={"up"}/></div>)}
          </div>
        }
        <PortraitPots pots={table.pots}/>
      </div>
      <div className={classes.nearUsersRec}>
        {positioner(<PortraitPlate key={2} player={getCurrentUserPlayer(table, 2)}/>, <PortraitPlate key={0} player={getCurrentUserPlayer(table, 0)}/>)}
      </div>
      <div className={classes.currentUserRec}>
        {positioner(<PortraitPlate key={1} size={"large"} player={getCurrentUserPlayer(table, currentUserPosition)}/>)}
      </div>
      <div className={classes.tableBorder}/>
      <Sounds isSoundActive={true}/>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS, auth } = state
  let table = tableWS.table;
  return {
    table: table,
    bigBlind: table.bigBlind,
    currentUserPosition: tableWS.currentUserPosition,
    isAuthenticated: auth.isAuthenticated};
};

export default connect(mapStateToProps, {newEvent, setCurrentUserPosition})(PortraitTable)
