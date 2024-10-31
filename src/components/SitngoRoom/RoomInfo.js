import React from "react";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import moment from "moment";
import Timer from "react-compound-timer";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  autostartCountDown: {
    width: '60px',
    display: 'inline-block'
  }
}));

const RoomInfo = ({room}) => {
  const {t} = useTranslation();
  const classes = useStyles()

  return (
    <div>
      {
        room.lobbyTable &&
        <>
          <div>{t("RoomInfo.Game")} {room.bettingLimit} Hold'em</div>
          <div>{t("RoomInfo.BuyIn")} {room.buyIn} {t("chips")}</div>
          <div>{t("RoomInfo.BigBlind")} {room.lobbyTable.bigBlind} {t("chips")}</div>
          <div>{t("RoomInfo.Decision")} {room.lobbyTable.decisionTimeoutSec} {t("sec")}</div>
          <div>{t("RoomInfo.StartingStack")} {room.startingChips} {t("chips")}</div>
          <div>{t("RoomInfo.BlindsUpTime")} {room.levelIncreaseTimeMinutes} {t("min")}</div>
          {
            room.startAt > 0 &&
            <div>
              {t("RoomInfo.AutostartAt")}
              {moment(room.startAt).format("HH:mm")}&nbsp;
              {
                room.startAt > Date.now() && <div className={classes.autostartCountDown}>(
                <Timer initialTime={room.startAt - Date.now()} direction="backward"
                       formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
                  <Timer.Minutes/>:<Timer.Seconds/>
                </Timer>)
              </div>

              }
            </div>
          }
        </>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const { sitngoRoom } = state
  return {
    room: sitngoRoom.room
  };
};

export default connect(mapStateToProps)(RoomInfo)