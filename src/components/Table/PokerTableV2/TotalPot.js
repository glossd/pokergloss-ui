import React from "react";
import {ModelTableStatusEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";
import {adaptChipsToBB} from "../util";

const TotalPot = ({tableStatus, tableTotalPot, isChipsInBB, bigBlind}) => {
  if (!tableTotalPot || tableStatus === ModelTableStatusEnum.Waiting) {
    return <span/>
  }
  return <span className='chips-background'>{`Pot: ${isChipsInBB ? adaptChipsToBB(tableTotalPot, bigBlind) : tableTotalPot}`}</span>
}

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  return {
    tableStatus: table.status,
    tableTotalPot: table.totalPot,
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind
  }
};

export default connect(mapStateToProps)(TotalPot)