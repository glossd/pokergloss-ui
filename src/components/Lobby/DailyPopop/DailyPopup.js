import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import React, {useEffect, useState} from "react";
import {getBonusDay, setBonusDay} from "../../bonusStorage/bonusStorage";
import {takeDailyBonus} from "../../../backend/bonus";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";
import DailyAssignments from "./DailyAssignments";
import DailyBonus from "./DailyBonus";

function DailyPopup({isAuthenticated, isAnonymous}) {
  const {t} = useTranslation();
  const [bonus, setBonus] = useState(null)
  const [dayInARow, setDayInARow] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    if (isAnonymous) {
      return
    }

    let bonusDay = getBonusDay()
    let todayDay = new Date().setUTCHours(0, 0, 0, 0)

    if (!bonusDay || bonusDay.toString() !== todayDay.toString()) {
      takeDailyBonus()
        .then(data => {
          if (data.isBonusPresent) {
            setBonus(data.bonus.chips)
            setDayInARow(data.bonus.dayInARow)
            setBonusDay(todayDay.toString())
          }
        })
        .catch(backendError)
    }
  }, [isAuthenticated, isAnonymous])

  const handleClose = () => {
    setBonus(null)
  };

  return (
    <DefaultDialog
      open={!!bonus}
      onClose={handleClose}
      title={t("lobby.DailyPopup.DailyBonus")}
      action={{text: t("Great"), onClick: handleClose}}
    >
      <DailyBonus bonus={bonus} dayInARow={dayInARow}/>
      <DailyAssignments/>
    </DefaultDialog>
  )
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isAnonymous: state.auth.isAnonymous
  }
}

export default connect(mapStateToProps)(DailyPopup)