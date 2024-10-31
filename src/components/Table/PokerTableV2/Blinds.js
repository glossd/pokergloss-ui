import React from "react";
import {connect} from "react-redux";
import {getBlindPositions} from "../util";
import {ModelPlayerBlindEnum} from "@pokergloss/table-client-typescript";
import Blind from "./Blind";

const Blinds = ({table}) => {
  if (!table.seats) {
    return <div/>
  }
  const {bigBlind, smallBlind, dealer} = getBlindPositions(table.seats)
  return (
    <>
      <Blind position={bigBlind} blind={ModelPlayerBlindEnum.BigBlind} tableSize={table.size}/>
      <Blind position={smallBlind} blind={ModelPlayerBlindEnum.SmallBlind} tableSize={table.size}/>
      <Blind position={dealer} blind={ModelPlayerBlindEnum.Dealer} tableSize={table.size}/>
    </>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return {
    table: tableWS.table
  };
};

export default connect(mapStateToProps)(Blinds)
