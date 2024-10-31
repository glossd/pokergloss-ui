import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTranslation} from "next-i18next";
import {isIOS, isMobile} from "react-device-detect";
import {rootStyle} from "./util";
import {connect} from "react-redux";

let inDevEnvironment = false;
if (process && process.env.NODE_ENV === 'development') {
  inDevEnvironment = true;
}

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: "100%",
    zIndex: 2,
  },
  darkBack: {
    background: "rgba(0, 0, 0, 0.5)",
  },
  girlMessage: {
    position: "absolute",
    bottom: "1%",
    left: "5%",
    display: "flex",
    zIndex: 1,
  },
  girl: {
    width: 108,
    height: 300,
  },
  girlImg: {
    height: "100%",
  },
  message: {
    width: 300,
    maxHeight: "90vh",
    overflowY:"auto",
    height: "fit-content",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    '&:after': {
      content: "''",
      position: 'absolute',
      right: 350,
      top: 1,
      width: 0,
      height: 0,
      border: '25px solid transparent',
      borderRightColor: 'white',
      borderLeft: 0,
      borderTop: 0,
      marginTop: '1vw',
      marginLeft: '1vw',
      zIndex: -1
    },
  },
  gotItBtn: {
    left: "5%",
    color: "white",
    backgroundColor: "#088c08",
    height: "fit-content"
  },
  highlight: {
    position: "absolute",
    boxShadow: "0px 0px 0px 8000px rgba(0, 0, 0, 0.5)"
  },
  rootPortrait: {
    position: 'absolute',
    width: "100%",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  girlAndGotItPortrait: {
    display: "flex",
    alignItems: "flex-start",
  },
  girlImgPortrait: {
    width: "50%",
  },
  messagePortrait: {
    width: "80%",
    maxHeight: "90vh",
    overflowY:"auto",
    height: "fit-content",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginTop: "50%",
    marginLeft: "10%"
  },
  gotItBtnPortrait: {
    color: "#080806",
    backgroundColor: "#ffeb84",
    marginTop: "5%",
    marginLeft: "10%"
  }
}))


const mobileStyles = makeStyles(() => ({
  girl: {
    width: 115,
    height: 300,
  }
}))

const desktopStyles = makeStyles(() => ({
  girl: {
    height: "60vh",
    width: "23vh",
  }
}))

export const tutorialGirlPoses = Object.freeze({
  crossHands: "crossHands",
  pointingFinger: "pointingFinger",
  ok: "ok"
});

const defaultPoses = [tutorialGirlPoses.crossHands, tutorialGirlPoses.pointingFinger]

const Girl = ({message, close, highlight, pose, messageSize}) => {
  const { t } = useTranslation();

  const isPortrait = useMediaQuery('(orientation: portrait)')
  const useHighlight = !isMobile && highlight

  const classes = useStyles()
  const platformClasses = isMobile ? mobileStyles() : desktopStyles()

  function getPoseImageSource(pose) {
    switch (pose) {
      case tutorialGirlPoses.ok:
        return "https://storage.googleapis.com/pokerblow/tutorial/girlOk.png"
      case tutorialGirlPoses.crossHands:
        return "https://storage.googleapis.com/pokerblow/tutorial/girlCrossHands.png"
      case tutorialGirlPoses.pointingFinger:
        return "https://storage.googleapis.com/pokerblow/tutorial/girlPointingFinger.png"
    }
  }

  // useEffect(() => {
  //   if (inDevEnvironment) {
  //     close()
  //   }
  // })


  if (!message) {
    return <div/>
  }

  let finalPose = pose
  if (!finalPose) {
    finalPose = defaultPoses[Math.floor(Math.random() * defaultPoses.length)]
  }

  if (isMobile && isPortrait) {
    return (
      <div className={classes.rootPortrait}>
        <div className={classes.messagePortrait}>{message}</div>
        <div className={classes.girlAndGotItPortrait}>
          <img className={classes.girlImgPortrait} src={getPoseImageSource(finalPose)} alt=""/>
          <Button className={classes.gotItBtnPortrait} onClick={close}>{t("ok")}</Button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={rootStyle(isIOS && !isPortrait)}
      className={`${classes.root} ${useHighlight ? '' : classes.darkBack}`}
    >
      <div className={classes.girlMessage}>
        <div className={platformClasses.girl}>
          <img className={classes.girlImg} src={getPoseImageSource(finalPose)} alt=""/>
        </div>

        <div className={classes.message} style={messageSize === "large" ? {width: "420px"} : {}}>
          {message}
        </div>

        <Button className={classes.gotItBtn} onClick={close}>{t("ok")}</Button>
      </div>

      {useHighlight && <div className={classes.highlight} style={highlight}/>}
    </div>
  )
}

const mapStateToProps = state => {
  const {tutorial} = state
  const girl = tutorial.girl
  return {message: girl.message, close: girl.next, highlight: girl.highlight, pose: girl.pose, messageSize: girl.messageSize}
};


export default connect(mapStateToProps) (Girl)
