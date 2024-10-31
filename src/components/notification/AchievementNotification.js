import React from "react";
import {gotAchievementPrize} from "../../redux/actions/news";
import {connect} from "react-redux";
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import {useTranslation} from "next-i18next";
import {ModelAchievementTypeEnum} from "@pokergloss/achievement-client-typescript";
import AutoAwayNotification from "../UI/AutoAwayNotification";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    backgroundColor: "#4cab02",
    borderRadius: '10px',
  },
  notificationIcon: {
    width: "50px",
    height: "50px",
    margin: "10px",
    color: 'white'
  },
  nameAndText: {
    display: "flex",
    flexDirection: "column",
    marginTop: '10px',
    color: 'white'
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '300px',
    minWidth: "150px",
    whiteSpace: 'nowrap',
    marginRight: '10px'
  }
}));

function AchievementNotification({newAchievementPrize, gotAchievementPrize}) {
  const { t } = useTranslation();
  const classes = useStyles()

  const handleClose = () => {
    gotAchievementPrize()
  };

  if (!newAchievementPrize.chips) {
    return <div/>
  }

  let title
  switch (newAchievementPrize.type) {
    case ModelAchievementTypeEnum.Win:
      title = `You are a ${newAchievementPrize.name} ${newAchievementPrize.count} times`
      break
    case ModelAchievementTypeEnum.Hand:
      title = `${t("table.HandName." + newAchievementPrize.name)} ${newAchievementPrize.count} ${t("Notifications.times")}`
      break
    default:
      title = `${newAchievementPrize.name} ${newAchievementPrize.count} times`
  }

  return (
    <AutoAwayNotification open={!!newAchievementPrize.chips} onClose={handleClose}>
      <div className={classes.root}>
        <EmojiEventsIcon className={classes.notificationIcon}/>
        <div className={classes.nameAndText}>
          <div className={classes.title}>{title}</div>
          <div className={classes.description}>{`${t("Notifications.CongratulationsYouHaveEarned")} ${newAchievementPrize.chips} ${t("Notifications.chips")}`}</div>
        </div>
      </div>
    </AutoAwayNotification>
  )
}

const mapStateToProps = state => {
  const { news } = state
  return {newAchievementPrize: news.newAchievementPrize};
};

export default connect(mapStateToProps, {gotAchievementPrize})(AchievementNotification)