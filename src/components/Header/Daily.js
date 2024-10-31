import React, {useEffect} from "react";
import Badge from "@material-ui/core/Badge";
import {Assignment} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {setDailyAssignments, setOpenDailyAssignments} from "../../redux/actions/news";
import {backendError} from "../../backend/error";
import {getMyDailyAssignments} from "../../backend/assignment";

const styles = makeStyles(() => ({
  icon: {
    '&:hover': {
      color: '#8ab8c9',
    },
  },
  dailyIcon: {
    color: "white",
    padding: "12px"
  },
}));

const Daily = ({isAuthenticated, isAnonymous, dailyAssignments, setDailyAssignments, setOpenDailyAssignments}) => {
  const classes = styles()

  useEffect(() => {
    if (isAuthenticated && !isAnonymous) {
      if (!dailyAssignments || dailyAssignments.length === 0) {
        getMyDailyAssignments()
          .then(assignments => setDailyAssignments(assignments))
          .catch(backendError)
      }
    }
  }, [isAuthenticated, isAnonymous])

  const onDailyClick = () => {
    setOpenDailyAssignments(true)
  }

  const uncompletedAssignmentsCount = dailyAssignments.filter(a => a.currentCount < a.count).length

  return (
    <div>
      {isAuthenticated && !isAnonymous &&
      <IconButton className={classes.dailyIcon} onClick={onDailyClick}>
        <Badge badgeContent={uncompletedAssignmentsCount} color="primary" invisible={uncompletedAssignmentsCount === 0}>
          <Assignment className={classes.icon}/>
        </Badge>
      </IconButton>}
    </div>
  )
}

const mapStateToProps = state => {
  const {auth, news} = state
  return {
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
    dailyAssignments: news.dailyAssignments
  };
};

export default connect(mapStateToProps, {setDailyAssignments, setOpenDailyAssignments})(Daily)