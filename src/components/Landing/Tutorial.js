import React, {useRef} from "react";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import GoldButton from "./GoldButton";
import {animated, Spring} from "react-spring";
import {desktopInfoStyles, mobileInfoStyles, useOnScreen} from "./util";
import {useRouter} from "next/router";

const Tutorial = () => {
  const { t } = useTranslation();
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
            from={{y: -100, opacity: 0}}
            to={{y: 0, opacity: 1}}
            config={{mass: 2, tension: 180, friction: 12}}
          >
            {
              props =>
                <animated.div style={props}>
                  {t("Landing.tutorial")}
                </animated.div>
            }
          </Spring>

          <Spring
            from={{paddingTop: 20, paddingBottom: 0}}
            to={{paddingTop: 0, paddingBottom: 20}}
            config={{duration: 700}}
            loop={{reverse: true}}
          >
            {
              props =>
                <animated.div style={props}>
                  <ArrowDownwardIcon className={classes.arrow}/>
                  <ArrowDownwardIcon className={classes.arrow}/>
                  <ArrowDownwardIcon className={classes.arrow}/>
                </animated.div>
            }
          </Spring>

          <div className={classes.buttonContainer}>
            <Spring
              from={{opacity: 0, x: 500}}
              to={{opacity: 1, x: 0}}
              config={{mass: 1, tension: 180, friction: 12}}
            >
              {
                props =>
                  <animated.div style={props}>
                    <GoldButton
                      className={classes.button}
                      onClick={() => router.push("/tutorial")}
                    >{t("Start")}</GoldButton>
                  </animated.div>
              }
            </Spring>
          </div>
        </div>
      }
    </div>
  )
}

export default Tutorial