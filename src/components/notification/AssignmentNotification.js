import AutoAwayNotification from "../UI/AutoAwayNotification";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {assignmentFullName} from "../assignment/util";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import {deleteChangedAssignment} from "../../redux/actions/news";
import {Assignment, AssignmentTurnedIn} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: "#5ac420",
    borderRadius: '10px',
    flexDirection: "column",
    padding: '10px',
    color: "white"
  },
  icon: {
    marginRight: "5px"
  },
  assignmentName: {
    margin: '5px',
  }
}))

const AssignmentNotification = ({changedAssignment, deleteChangedAssignment}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  return (
    <AutoAwayNotification open={!!changedAssignment} onClose={deleteChangedAssignment}>
      {
        changedAssignment &&
        <div className={classes.root}>
          <div>
            {changedAssignment.currentCount === changedAssignment.count
              ? <AssignmentTurnedIn fontSize={"large"} className={classes.icon}/>
              : <Assignment fontSize={"large"} className={classes.icon}/>}
            { <span>{changedAssignment.currentCount} {t("dailyAssignments.OutOf")} {changedAssignment.count}</span>}
          </div>
          <div className={classes.assignmentName}>{assignmentFullName(t, changedAssignment)}</div>
        </div>
      }
    </AutoAwayNotification>
  )
}

const mapStateToProps = state => {
  const { news } = state
  return { changedAssignment: news.changedAssignment};
};


export default connect(mapStateToProps, {deleteChangedAssignment})(AssignmentNotification)
