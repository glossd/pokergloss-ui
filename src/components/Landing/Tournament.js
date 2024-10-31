import React, {useRef} from "react";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import GoldButton from "./GoldButton";
import {animated, Spring} from "react-spring";
import {desktopInfoStyles, mobileInfoStyles, useOnScreen} from "./util";
import {useRouter} from "next/router";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const Tournament = () => {
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileInfoStyles() : desktopInfoStyles()

  const ref = useRef();
  const onScreen = useOnScreen(ref, "-5%");
  const router = useRouter();

  return (
    <div className={classes.root} ref={ref}>

      {
        onScreen &&
        <div className={classes.message}>
          <Spring
            from={{y: -100, opacity: 0, marginBottom: 20}}
            to={{y: 0, opacity: 1}}
            config={{mass: 2, tension: 180, friction: 12}}
          >
            {
              props =>
                <animated.div style={props}>
                    {t("Landing.tournament.name")} Poker<span style={{color: "#57bcde"}}>Gloss </span>
                    {t("Landing.tournament.time")}
                    {t("Landing.tournament.prize")}
                </animated.div>
            }
          </Spring>

          <div className={classes.buttonContainer}>
            <Spring
              from={{opacity: 0, x: -500, display: "flex", alignItems: "center"}}
              to={{opacity: 1, x: 0}}
              config={{mass: 1, tension: 180, friction: 12}}
            >
              {
                props =>
                  <animated.div style={props}>

                    <Spring
                      from={{paddingRight: 20, paddingLeft: 0, display: "flex"}}
                      to={{paddingRight: 0, paddingLeft: 20}}
                      config={{duration: 700}}
                      loop={{reverse: true}}
                    >
                      {
                        props =>
                          <animated.span style={props}>
                            <ArrowForwardIcon/>
                          </animated.span>
                      }
                    </Spring>

                    <GoldButton
                      className={classes.button}
                      onClick={() => router.push("/lobby/multi/5fea7180df0ccde21ef5e2c0")}
                    >{t("Register")}</GoldButton>

                    <Spring
                      from={{paddingRight: 0, paddingLeft: 20, display: "flex"}}
                      to={{paddingRight: 20, paddingLeft: 0}}
                      config={{duration: 700}}
                      loop={{reverse: true}}
                    >
                      {
                        props =>
                          <animated.span style={props}>
                            <ArrowBackIcon/>
                          </animated.span>
                      }
                    </Spring>

                  </animated.div>
              }
            </Spring>
          </div>
        </div>
      }
    </div>
  )
}

export default Tournament
