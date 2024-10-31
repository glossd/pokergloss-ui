import LinearProgress from "@material-ui/core/LinearProgress";
import React from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import {setOpenDailyAssignments} from "../../redux/actions/news";
import {useTranslation} from "next-i18next";
import {assignmentFullName} from "./util";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "80vw",
    maxHeight: "50vh",
    width: "500px",
    height: "300px"
  },
  assignment: {
    width: '90%',
    margin: '0 5% 5% 5%'
  },
  progressBar: {
    width: '100%',
    padding: '0 5%',
    borderRadius: '1em',
    height: '0.5em'
  },
  sumUp: {
    position: 'relative',
    float: 'right'
  },
  prize: {
    color: "#05c10b"
  }
}));

const DailyAssignmentsDialog = ({dailyAssignments, isOpen, setOpenDailyAssignments}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const handleClose = () => {
    setOpenDailyAssignments(false)
  }
  return (
    <DefaultDialog
      open={!!isOpen}
      onClose={handleClose}
      title={t("DailyAssignments")}
      action={{text: t("gotIt"), onClick: handleClose}}
    >
      <div className={classes.root}>
        {
          dailyAssignments && dailyAssignments.map(a =>
            <div key={a.type} className={classes.assignment}>
              <div className={classes.sumUp}>{a.currentCount} {t("dailyAssignments.OutOf")} {a.count}</div>
              <div>{assignmentFullName(t, a)}</div>
              <LinearProgress className={classes.progressBar} variant="determinate" value={100 / a.count * a.currentCount} />
              <div>{t("Prize")}: <span className={classes.prize}>{a.prize}</span> {t("chips")}</div>
            </div>
          )
        }
      </div>
    </DefaultDialog>
  )
}

const mapStateToProps = state => {
  const {news} = state
  return {
    dailyAssignments: news.dailyAssignments,
    isOpen: news.isAssignmentsOpen
  };
};

export default connect(mapStateToProps, {setOpenDailyAssignments})(DailyAssignmentsDialog)