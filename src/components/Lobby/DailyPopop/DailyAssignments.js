import React from "react";
import {connect} from "react-redux";
import {assignmentFullName} from "../../assignment/util";
import {useTranslation} from "next-i18next";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    fontSize: '25px',
    fontWeight: 'bold',
    color: '#05c10b',
    margin: '20px 0 6px 0',
  },
  assignment: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
  },
  prizeContainer: {
    width: '33%'
  },
  prize: {
    color: "#05c10b"
  }
}));

const DailyAssignments = ({dailyAssignments}) => {
  const classes = useStyles()
  const { t } = useTranslation();
  const isPortrait = useMediaQuery('(orientation: portrait)')

  return (
    <div>
      {
        dailyAssignments && <div className={classes.title}>{t("DailyAssignments")}</div>
      }

      <div>
        {
          dailyAssignments &&
          dailyAssignments.map((assignment, index) =>
          <div key={assignment.type} className={classes.assignment}>
            <div>{index+1}. {assignmentFullName(t, assignment)}</div>
            {
              !isPortrait &&
              <div className={classes.prizeContainer}>{t("Prize")}: <span className={classes.prize}>{assignment.prize}</span> {t("chips")}</div>
            }
          </div>
          )
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const {news} = state
  return {
    dailyAssignments: news.dailyAssignments,
  };
};

export default connect(mapStateToProps)(DailyAssignments)