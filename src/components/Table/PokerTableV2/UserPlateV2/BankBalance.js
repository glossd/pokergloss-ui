import React from "react";
import TextShadow from "../../../UI/TextShadow/TextShadow";

const BankBalance = React.memo(({bankBalance, className, fontSize}) => {
  function adaptBankBalance(chips) {
    if (chips < 1000) {
      return chips
    }
    if (chips < 10000) {
      return chips.toString().substring(0, 1) + '.' + chips.toString().substring(1, 3) + 'K'
    }
    if (chips < 100000) {
      return chips.toString().substring(0, 2) + '.' + chips.toString().substring(2, 3) + 'K'
    }
    if (chips < 1000000) {
      return chips.toString().substring(0, 3) + 'K'
    }
    if (chips < 10000000) {
      return chips.toString().substring(0, 1) + '.' + chips.toString().substring(1, 3) + 'M'
    }
    if (chips < 100000000) {
      return chips.toString().substring(0, 2) + '.' + chips.toString().substring(2, 3) + 'M'
    }
    if (chips < 1000000000) {
      return chips.toString().substring(0, 3) + 'M'
    }
    return 'B'
  }

  if (bankBalance === undefined) {
    return <div/>
  }

  return (
    <TextShadow style={fontSize ? {fontSize} : {}} className={className}>{adaptBankBalance(bankBalance)}</TextShadow>
  )
})

export default BankBalance