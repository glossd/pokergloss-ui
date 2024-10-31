import React, {useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import {fetchTopRatings} from "../../redux/actions/landing";
import Loader from "../UI/Loader/Loader";
import TopThreePlayers from "./TopThreePlayers";
import TopPlayersTable from "./TopPlayersTable";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";

const useStyles = makeStyles(() => ({
  title: {
    color: "#ffffff",
    fontSize: "3em",
    '&:hover': {
      color: "#0facdd",
      cursor: "pointer"
    }
  }
}));

const Leaderboard = ({loading}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const {t} = useTranslation();

  useEffect(() => {
    fetchTopRatings(dispatch)
  }, []);

  function openRating() {
    router.push("/rating")
  }

  if (loading) {
    return <Loader/>
  }

  return (
    <div>
      <div>
        <span className={classes.title} onClick={openRating}>
          {t("Leaderboard")}
        </span>
      </div>

      <TopThreePlayers/>
      <TopPlayersTable/>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    loading: state.landing.loading
  }
}

export default connect(mapStateToProps)(Leaderboard)
