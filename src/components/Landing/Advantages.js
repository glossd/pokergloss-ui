import React, {useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {animated, Spring} from "react-spring";
import {useOnScreen} from "./util";

const desktopStyles = makeStyles(() => ({
  root: {
    height: "100vh",
  },
  advantage: {
    height: "50%",
    width: "50%",
    float: "left",
    display: "flex",
    alignItems: "center",
    padding: "2%",
  },
  suit: {
    height: "70%"
  },
  text: {
    color: "white",
    fontSize: "2vw",
    fontWeight: "bold",
    padding: "0 5px",
    textAlign: "center",
  }
}));

const mobilePortraitStyles = makeStyles(() => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  advantage: {
    height: "24%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5%",
  },
  suit: {
    height: "90%"
  },
  text: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "0 5px",
    textAlign: "center",
  }
}));

const Advantages = ({}) => {
  const { t } = useTranslation();

  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? mobilePortraitStyles() : desktopStyles()

  const ref = useRef();
  const onScreen = useOnScreen(ref, "-5%");

  const advantage1 = {
    suitURL: "https://storage.googleapis.com/pokerblow/landing/Hearts.png",
    text: t("Landing.advantage1"),
    springX: -300
  }
  const advantage2 = {
    suitURL: "https://storage.googleapis.com/pokerblow/landing/Clubs.png",
    text: t("Landing.advantage2"),
    springX: 300
  }
  const advantage3 = {
    suitURL: "https://storage.googleapis.com/pokerblow/landing/Diamonds.png",
    text: t("Landing.advantage3"),
    springX: 300
  }
  const advantage4 = {
    suitURL: "https://storage.googleapis.com/pokerblow/landing/Spades.png",
    text: t("Landing.advantage4"),
    springX: -300
  }

  let advantages = [advantage1, advantage2]
  if (isPortrait) {
    advantage3.springX = -300
    advantage4.springX = 300
    advantages = advantages.concat([advantage3, advantage4])
  } else {
    advantages = advantages.concat([advantage4, advantage3])
  }

  return (
    <div className={classes.root} ref={ref}>
      {
        onScreen && advantages.map((advantage, index) => {
          return (
            <Spring
              key={index}
              from={{opacity: 0, x: advantage.springX}}
              to={[{opacity: 1, x: 0, delay: index*500}]}
              config={{ mass: 1, tension: 180, friction: 12 }}
            >
              {
                props =>
                  <animated.div style={props} className={classes.advantage}>
                    <img className={classes.suit} src={advantage.suitURL} alt=""/>
                    <div className={classes.text}>{advantage.text}</div>
                  </animated.div>
              }
            </Spring>
          )
        })
      }
    </div>
  )
}

export default Advantages
