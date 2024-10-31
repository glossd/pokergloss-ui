import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {deleteTournamentTableId} from "../../redux/actions/news";
import {useRouter} from "next/router";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import GreenNotification from "../UI/GreenNotification";
import NewReleases from "@material-ui/icons/NewReleases";
import {useTranslation} from "next-i18next";
import useSound from "use-sound";

function TournamentStartedNotification({multiTableId, sitngoTableId, deleteTournamentTableId}) {
  const {t} = useTranslation();
  const router = useRouter();

  const [playTournamentStarted, soundData] = useSound("https://storage.googleapis.com/pokerblow/sounds/notification.mp3", { volume: 1});

  useEffect(() => {
    if (multiTableId) {
      playTournamentStarted()
    }
  }, [multiTableId])

  useEffect(() => {
    if (sitngoTableId) {
      playTournamentStarted()
    }
  }, [sitngoTableId])


  useEffect(() => {
    return () => {
      soundData.stop()
    }
  }, [])

  const handleGoToTable = () => {
    deleteTournamentTableId()
    if (!!multiTableId) {
      router.push("/tables/" + multiTableId);
    }
    if (!!sitngoTableId) {
      router.push("/tables/" + sitngoTableId);
    }
  }

  const handleClose = () => {
    deleteTournamentTableId()
  };

  const getTitle = () => {
    if (!!multiTableId) {
      return t("Tournament") + " " + t("Notifications.HasStarted")
    }
    if (!!sitngoTableId) {
      return t("SitNGo") + " " + t("Notifications.HasStarted")
    }
    return ""
  }

  return (
    <GreenNotification
      open={!!multiTableId || !!sitngoTableId}
      onClose={handleClose}
      onAction={handleGoToTable}
      notificationIcon={<NewReleases fontSize="inherit"/>}
      actionIcon={<PlayCircleOutlineIcon fontSize="large"/>}
      title={getTitle()}
      description={t("Notifications.JoinYourTable")}
    />
  )
}

const mapStateToProps = state => {
  const { news } = state
  return { multiTableId: news.multiTableId, sitngoTableId: news.sitngoTableId};
};

export default connect(mapStateToProps, {deleteTournamentTableId})(TournamentStartedNotification)
