import React from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: 'white',
    padding: '5px',
    fontSize: '17px',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  cup: {
    width: '20%',
    height: '20%',
    margin: '0 1vw',
  }
}));

const RoomPrizes = ({room}) => {
  const { t } = useTranslation();
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <div>{t("Prizes")}</div>
        <img className={classes.cup} src="https://storage.googleapis.com/pokerblow/lobby-sitngo/cup.png" alt="cup"/>
      </div>

      {room && room.prizes && room.prizes.map(prize => {
        return (
          <div key={prize.place}>
            <span>{prize.place} {t("place")}:</span>
            <span> {prize.prize} {t("chips")}</span>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = state => {
  const { sitngoRoom } = state
  return {
    room: sitngoRoom.room
  };
};

export default connect(mapStateToProps)(RoomPrizes)