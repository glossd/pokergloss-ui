import React from "react";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  message: {
    textAlign: 'center'
  },
  daysContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  note: {
    fontSize: '13px',
    color: '#8e8989',
  },
  redChip: {
    width: '30px',
    height: '30px'
  }
}));

const DailyBonus = ({bonus, dayInARow}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const isPortrait = useMediaQuery('(orientation: portrait)')

  function calculateBonus(day) {
    let calculateResult = 500 + Math.sqrt(2 * (day - 1)) * 500
    return (
      Math.floor(calculateResult)
    )
  }

  function dayPlate(day, select) {
    let background = '#0e5ead'
    if (select) {
      background = '#27a1ee'
    }

    return (
      <div className='bonusDay' style={{background: background}}>
        <div className='day-number'>
          {t("lobby.DailyPopup.Day")} {day}
        </div>

        <img src='https://storage.googleapis.com/pokerblow/poker-table/bet-chips.png' className={classes.redChip} alt='redChip'/>

        <h3 style={{marginBottom: '-3px'}}>{calculateBonus(day).toString()}</h3>
        <h6 style={{textTransform: 'uppercase'}}>{t("chips")}</h6>
      </div>
    )
  }

  return (
    <div>
      <div className={classes.message}>
        <h4>{t("lobby.DailyPopup.YouEarned")}</h4>
        <h1 style={{fontSize: '400%'}}>{bonus}</h1>
        <h1 style={{fontSize: '250%', textTransform: 'uppercase'}}>{t("lobby.DailyPopup.FreeChips")}!</h1>
        <div className={classes.daysContainer}>
          {dayPlate(dayInARow, true)}
          {dayPlate(dayInARow + 1)}
          {!isPortrait &&
          <>
            {dayPlate(dayInARow + 2)}
            {dayPlate(dayInARow + 3)}
            {dayPlate(dayInARow + 4)}
          </>}
        </div>
      </div>

      {!isPortrait &&
      <div>
        <p className={classes.note}>*{t("chips")} =
          500*√(2*({t("lobby.DailyPopup.Day")} -
          1)) + 500</p>
        <p className={classes.note}>**{t("lobby.DailyPopup.UTCMessage")}</p>
      </div>}
    </div>
  )
}

export default DailyBonus