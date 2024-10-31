import React, {useEffect, useState} from "react";
import YouTube from "react-youtube";
import {makeStyles} from "@material-ui/core/styles";
import SurvivalButton from "./SurvivalButton";
import {useTranslation} from "next-i18next";
import {disableFullScreen, enableFullScreen} from "../../Table/util";
import {startSurvival} from "../../../backend/survival";
import {forceRefreshIdToken, getCurrentUser} from "../../../auth/Firebase";
import {backendError} from "../../../backend/error";
import {useRouter} from "next/router";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {connect} from "react-redux";
import {setFullscreen} from "../../../redux/actions/table";
import {setSurvivalAnonymousDialogOpen, setSurvivalNoTicketsDialogOpen} from "../../../redux/actions/lobby";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Loader from "../../UI/Loader/Loader";

const useStyles = makeStyles(() => ({
  rootIntro: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  videoStarted: {
    position: "fixed",
    width: '100vw',
    minHeight: '100vh',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  background: {
    position: "fixed",
    backgroundColor: "black",
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    zIndex: 1
  },
  videoWrapper: {
    zIndex:1,
    position: "absolute"
  },
  closeButton: {
    position: "fixed",
    top: "1%",
    right: "1%",
    color: "white",
    zIndex: 3,
  },
  closeIcon: {
    background: "#505050",
    borderRadius: "50%",
    opacity: .7,
    "&:hover": {
      opacity: .9,
    }
  }
}));

const portraitStyles = makeStyles(() => ({
  videoHidden: {
    opacity: "0",
    width: "52vw",
    height: "45vw",
  },
  startBtn: {
    width: "52vw",
    height: "13vw"
  },
}))

const landscapeStyles = makeStyles(() => ({
  videoHidden: {
    opacity: "0",
    width: "26vw",
    height: "20vw",
  },
  startBtn: {
    width: "26vw",
    height: "6vw"
  },
}))

const Intro = ({isAuthenticated, isAnonymous, tickets, setFullscreen, setSurvivalAnonymousDialogOpen, setSurvivalNoTicketsDialogOpen}) => {
  const classes = useStyles()
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const adaptClasses = isPortrait ? portraitStyles() : landscapeStyles()
  const { t } = useTranslation();
  const router = useRouter();
  const [startedPlayingAt, setStartedPlayingAt] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Uncomment to play the video
  // const shouldPlayVideo = !sessionStorage.getItem("survival-played-counter")
  const shouldPlayVideo = false
  const incSurvivalVideoPlay = () => sessionStorage.setItem("survival-played-counter", "1")

  useEffect(() => {
    if (shouldPlayVideo) {
      setIsLoading(true)
    }
  }, [])

  const onEnd = (e, isFullscreen) => {
    if (tickets !== null && tickets <= 0) {
      setStartedPlayingAt(0)
      setSurvivalNoTicketsDialogOpen(true)
      return
    }
    incSurvivalVideoPlay()
    if (!isAuthenticated) {
      // first timer
      if (isFullscreen) {
        setFullscreen(true);
      }
      setStartedPlayingAt(0)
      setSurvivalAnonymousDialogOpen(true)
    } else {
      if (isAnonymous) {
        // anonymous second-time
        setStartedPlayingAt(0)
        setSurvivalAnonymousDialogOpen(true)
      } else {
        setIsLoading(true)
        startSurvival()
          .then(s => {
            if (isFullscreen) {
              setFullscreen(true);
            }
            router.push("/tables/" + s.tableId)
          }).catch(e => {
          if (e.response) {
            if (e.response.status === 401) {
              router.push("/signup")
            } else if (e.response.status === 403) {
              forceRefreshIdToken()
                .then(() => {
                  getCurrentUser()
                    .then(user => {
                      if (!user.emailVerified) {
                        router.push("/verify-email")
                      }
                    })
                })
            } else {
              backendError(e)
            }
          } else {
            backendError(e)
          }
          setStartedPlayingAt(0)
          disableFullScreen()
        });
      }
    }
  }

  const isPlaying = !!startedPlayingAt
  // Android sends pauses on the start of the video when size of youtube iframe changes.
  // But it instantly resumes playing
  const isAvailableForPause = () => {
    return Date.now() > (startedPlayingAt+500)
  }
  return (
    <div className={classes.rootIntro}>
      {isPlaying && <div className={classes.background}/>}
      {
        isPlaying &&
        <IconButton className={classes.closeButton} onClick={() => onEnd(null, true)}>
          <CloseIcon fontSize={"large"} className={classes.closeIcon}/>
        </IconButton>
      }
      {
        shouldPlayVideo &&
        <div className={classes.videoWrapper}>
          <YouTube
            videoId={"FheVuLcYAj8"}
            className={isPlaying ? classes.videoStarted : adaptClasses.videoHidden}
            onReady={() => {
              setIsLoading(false)
            }}
            onPlay={() => {
              enableFullScreen()
              setStartedPlayingAt(Date.now())
            }}
            onPause={(e) => {
              if (isAvailableForPause()) {
                onEnd(e, true)
              }
            }}
            onEnd={(e) => {
              onEnd(e, true)
            }}
            opts={{playerVars:{modestbranding:1, controls:0, cc_load_policy: navigator.language.startsWith("ru") ? 1 : 0, iv_load_policy: 3}}}
          />
        </div>
      }
      {
        isLoading ?
          <Loader/> :
          <SurvivalButton className={adaptClasses.startBtn} onClick={onEnd}>{t("Start")}</SurvivalButton>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const {auth} = state
  return {
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
  };
};

export default connect(mapStateToProps, {setFullscreen, setSurvivalAnonymousDialogOpen, setSurvivalNoTicketsDialogOpen})(Intro)
