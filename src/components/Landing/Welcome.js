import React, {useEffect, useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";
import YouTube from "react-youtube";
import {useTranslation} from "next-i18next";
import GoldButton from "./GoldButton";
import MovingPicture from "./MovingPicture";
import {animated, Spring, useTransition} from "react-spring";
import * as ReactGA from "react-ga";
import {useRouter} from "next/router";

const desktopStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "row",
    backgroundImage: "url('https://storage.googleapis.com/imagesforpoker/landing/figure.png')",
    backgroundPositionX: "center",
    backgroundSize: "cover",
  },
  photoContainer: {
    width: "0",
    position: "relative",
  },
  logo: {
    position: "absolute",
    left: "1%",
    top: "1%",
    width: "100px",
  },
  contentContainer: {
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative"
  },
  content: {
    color: "white",
    fontSize: "4vw",
    fontWeight: "bold",
    position: "absolute",
    top: "30%"
  },
  lobbyButton: {
    width: "43%",
    fontSize: "2.5em",
  },
  video: {
    position: "absolute",
    bottom: "2%",
    left: "2%"
  }
}));

const mobilePortraitStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  photoContainer: {
    height: "100vh",
    position: "relative",
    backgroundImage: "url('https://storage.googleapis.com/imagesforpoker/landing/figure.png')",
    backgroundPositionX: "center",
    backgroundSize: "cover",
  },
  logo: {
    position: "absolute",
    left: "1%",
    top: "1%",
    width: "20%",
  },
  contentContainer: {
    position: "absolute",
    top: "50%",
    height: "50%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  content: {
    color: "white",
    fontSize: "14vw",
    fontWeight: "bold",
    position: "absolute",
    top: "-60%"
  },
  lobbyButton: {
    width: "80%",
    fontSize: "2.5em",
  },
  video: {
    position: "absolute",
    bottom: "2%"
  }
}));

const commonStyles = makeStyles(() => ({
  movingBlow: {
    color: "#61dafb",
    display: "inline-block" /* animation doesn't work on span without inline-block https://stackoverflow.com/a/57941626/10160865 */
  }
}))

// https://stackoverflow.com/questions/63406435/how-to-detect-window-size-in-next-js-ssr-using-react-hook
function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return windowWidth;
}

const Welcome = () => {
  const {t} = useTranslation();

  const isPortrait = useMediaQuery('(orientation: portrait)')
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isPortrait ? mobilePortraitStyles() : desktopStyles()
  const commonClasses = commonStyles()
  let windowWidth = useWindowWidth();

  // config examples https://www.react-spring.io/docs/hooks/api
  const [blow,] = useState(false)
  const transitions = useTransition(blow, {
    config: {mass: 1, tension: 120, friction: 14},
    from: {transform: 'translate3d(300%,0,0)'},
    enter: {transform: 'translate3d(0,0px,0)'},
    leave: {transform: 'translate3d(0,-40px,0)'},
  })

  const router = useRouter();
  const goLobby = () => {
    ReactGA.event({
      category: "Landing",
      action: "Go To Lobby",
    });
    router.push("/lobby/survival")
  }

  function content() {
    return (
      <div className={classes.contentContainer}>
        <div className={classes.content}>
          {t("Landing.welcomeTo")} Poker
          {
            transitions((props, item, key) =>
              <animated.span className={commonClasses.movingBlow} key={key} style={props}>Gloss</animated.span>)
          }
        </div>

        <Spring
          from={{
            opacity: 0, x: 500 , width: "100%", textAlign: "center", position: "absolute",
            top: `${isPortrait ? "-15%" : "45%"}`
          }}
          to={{ opacity: 1, x: 0 }}
          config={{ mass: 1, tension: 180, friction: 12 }}
        >
          {
            props =>
              <animated.div style={props} >
                <GoldButton
                  className={classes.lobbyButton}
                  onClick={goLobby}
                >{t("Landing.lobby")}</GoldButton>
              </animated.div>
          }
        </Spring>

        {
          windowWidth &&
          <div className={classes.video}>
            <YouTube
              opts={
                isMobile ? {
                    width: 315,
                    height: 315 / 1.64
                  } :
                  {
                    width: windowWidth * 0.25,
                    height: windowWidth * 0.25 / 1.64
                  }
              }
              videoId={t("Landing.videoId")}
            />
          </div>
        }

      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.photoContainer}>

        <div className={classes.logo}>
          <MovingPicture src={"https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"}/>
        </div>

        { isPortrait && content() }
      </div>

      { !isPortrait && content() }
    </div>
  )
}

export default Welcome
