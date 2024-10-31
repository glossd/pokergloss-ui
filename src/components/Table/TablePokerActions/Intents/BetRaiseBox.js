import {ModelIntentTypeEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";
import {setCpBetting} from "../../../../redux/actions/table";
import DefaultCheckBox from "../../../UI/DefaultCheckBox/DefaultCheckBox";
import React from "react";
import {deleteIntent, setIntent} from "../../../../backend/table";
import {backendError} from "../../../../backend/error";
import {adaptChipsToBB} from "../../util";

const BetRaiseBox = ({tableId, currentUserPosition, totalRoundBet, isSomeoneBetBefore, cpIntent, cpBetting, isForceAllIn,
                       isChipsInBB, bigBlind}) => {

  const activeIntent = () => {
    if (cpBetting.isAllIn || isForceAllIn) {
      return ModelIntentTypeEnum.AllIn
    }
    if (isSomeoneBetBefore) {
      return ModelIntentTypeEnum.Raise
    } else {
      return ModelIntentTypeEnum.Bet
    }
  }

  const handleChangeIntent = (event) => {
    if (event.target.checked) {
      setIntent(tableId, currentUserPosition, event.target.name, cpBetting.chips)
        .catch(backendError)
    } else {
      deleteIntent(tableId, currentUserPosition)
        .catch(backendError)
    }
  }


  const aIntent = activeIntent()
  const chipsText = () => {
    switch (aIntent) {
      case ModelIntentTypeEnum.AllIn: return ""
      case ModelIntentTypeEnum.Bet: return " " + (isChipsInBB ? adaptChipsToBB(cpBetting.chips, bigBlind) : cpBetting.chips)
      case ModelIntentTypeEnum.Raise: return " " + (isChipsInBB ? adaptChipsToBB(cpBetting.chips + totalRoundBet, bigBlind) : cpBetting.chips + totalRoundBet)
      default: return ""
    }
  }
  return (
    <div className='intent-checkbox'>
      <DefaultCheckBox
        checked={cpIntent === aIntent}
        onChange={handleChangeIntent}
        name={aIntent}
        label={aIntent + chipsText()}
      />
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {tableId: tableWS.table.id,
    currentUserPosition: tableWS.currentUserPosition,
    cpBetting: tableWS.cpBetting,
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind
  };
};

export default connect(mapStateToProps, {setCpBetting})(BetRaiseBox)
