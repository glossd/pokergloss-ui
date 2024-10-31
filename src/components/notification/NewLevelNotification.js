import React from "react";
import {gotNewLevelPrize} from "../../redux/actions/news";
import {connect} from "react-redux";
import {TrendingUp} from "@material-ui/icons";
import {useTranslation} from "next-i18next";
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

function NewLevelNotification({exp, newLevelPrize, gotNewLevelPrize}) {
  const {t} = useTranslation();
  const classes = useStyles()
  const handleClose = () => {
    gotNewLevelPrize()
  };

  if (newLevelPrize === 0) {
    return <div/>
  }

  return (
    <AutoAwayNotification open={newLevelPrize > 0} onClose={handleClose}>
      <div className={classes.root}>
        <TrendingUp className={classes.notificationIcon}/>
        <div className={classes.nameAndText}>
          <div className={classes.title}>{`${t("Notifications.NewLevel")} ${exp ? exp.level : ""}`}</div>
          <div className={classes.description}>{`${t("Notifications.CongratulationsYouHaveEarned")} ${newLevelPrize} ${t("Notifications.chips")}`}</div>
        </div>
      </div>
    </AutoAwayNotification>
  )
}

const mapStateToProps = state => {
  const { news } = state
  return { exp: news.exp, newLevelPrize: news.newLevelPrize};
};

export default connect(mapStateToProps, {gotNewLevelPrize})(NewLevelNotification)
