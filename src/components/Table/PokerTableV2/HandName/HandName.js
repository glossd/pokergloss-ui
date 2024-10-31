import React from "react";

import {useTranslation} from "next-i18next";
import {handSolve} from "../../../util/handSolve";

const HandName = ({cards}) => {
  const { t } = useTranslation();

  function getDescr() {
    const solve = handSolve(cards);

    function adaptedDescr() {
      switch (solve.name) {
        case "High Card":
          return (solve.descr.substring(0, 2) + ' ')
        case "Straight":
          return solve.descr.substring(solve.name.length, solve.name.length + 4) + t("table.HandName.High Card")
        case "Flush":
          return solve.descr.substring(solve.name.length, solve.name.length + 5) + t("table.HandName.High Card")
        case "Straight Flush":
          if (solve.descr === "Royal Flush") {
            return t("table.HandName.Royal")
          } else {
            return solve.descr.substring(solve.name.length, solve.name.length + 5) + t("table.HandName.High Card")
          }
        default:
          return solve.descr.substring(solve.name.length, solve.descr.length)
      }
    }
    return `${t("table.HandName." + solve.name)}${adaptedDescr().replace(/'s/g, '')}`
  }

  return (
    <div className='hand-name'>
      <span>{cards.length >= 3 && getDescr()}</span>
    </div>
  )
}

export default HandName