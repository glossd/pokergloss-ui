import React, {useEffect, useState} from 'react'
import moment from "moment";
import Timer from "react-compound-timer";
import {useTranslation} from "next-i18next";

const TournamentStartTime = ({startAt, autoUpdate}) => {
  const {t} = useTranslation();
  /*TODO setTimeout?*/
  const [timeLeft, setTimeLeft] = useState(0)
  let secondsRemaining = (60 - (new Date()).getSeconds()) * 1000;

  if (autoUpdate) {
    setTimeout(() => {
      setTimeLeft(startAt - Date.now())
    }, secondsRemaining);
  }

  useEffect(() => {
    setTimeLeft(startAt - Date.now())
  }, [startAt])

  if (timeLeft < 0) {
    return (
      <span>{t("TournamentStartTime.isStarted")}</span>
    )
  }
  if (timeLeft < 60*1000) {
    return (
      <span>
        {t("TournamentStartTime.in")}&nbsp;
        <Timer key={timeLeft}
               initialTime={timeLeft}
               direction="backward">
          <Timer.Seconds/>
        </Timer>
        &nbsp;{t("TournamentStartTime.secs")}
      </span>
    )
  }
  if (timeLeft < 60*60*1000) {
    return (
      <span>
        {t("TournamentStartTime.in")}&nbsp;
        <Timer key={timeLeft}
               initialTime={timeLeft}
               direction="backward">
          <Timer.Minutes/>
        </Timer>
        &nbsp;{t("TournamentStartTime.mins")}
      </span>
    )
  } else {
    if (moment(startAt).isSame(moment(), 'day')) {
      return (
        <span>
          {t("TournamentStartTime.Today")},&nbsp;
          {moment(startAt).format('HH:mm')}
        </span>
      )
    } else {
      return (
        moment(startAt).format('DD MMM, HH:mm')
      )
    }
  }
}

export default TournamentStartTime