import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {
  closeSurvivalWheel,
  setSurvivalWheelAction, survivalWheelActions
} from "../../../redux/actions/news";
import TextShadow from "../../UI/TextShadow/TextShadow";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import ShineButton from "../../UI/Button/ShineButton/ShineButton";
import {releaseSurvival} from "../../../backend/survival";
import {backendError} from "../../../backend/error";
import Fireworks from "../../UI/Fireworks/Fireworks";
import {itemIcon} from "../../market/itemStore";
import dynamic from "next/dynamic";

const Wheel = dynamic(import ('react-custom-roulette').then(mod => mod.Wheel),{ssr:false});

const useStyles = makeStyles(() => ({
  wheel: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > div:first-child': {
      maxWidth: '700px',
      maxHeight: '700px',
      width: '40vw',
      height: '40vw'
    },
  },
  wheelButton: {
    position: 'fixed',
    bottom: '5%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 5,
  },
  prizeMessage: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: "#67e632",
    fontWeight: 'bold',
    fontSize: '60px',
    width: '100vw',
    zIndex: 6,
    animation: "$prizeMessageAnimation .5s ease-in-out"
  },
  "@keyframes prizeMessageAnimation": {
    "0%": {
      transform: 'translate(-50%, -50%) scale(.1) rotate(180deg) rotateX(-180deg)',
    },
    "100%": {
      transform: 'translate(-50%, -50%) scale(1) rotate(360deg) rotateX(0)',
    }
  },
  iconPrize: {
    width: '50px',
    height: '50px',
    display: "inline-block"
  },
  inline: {
    display: "inline-block"
  },
  lossMessage: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    zIndex: 5,
    textAlign: 'center',
    color: "#00ceff",
    fontWeight: 'bold',
    fontSize: '40px'
  }
}));

const SpinningWheel = ({survivalWheel, closeSurvivalWheel, survivalWheelAction, setSurvivalWheelAction}) => {
  const classes = useStyles()
  const router = useRouter();
  const {t} = useTranslation();

  const [mustSpin, setMustSpin] = useState(false);

  useEffect(() => {
    return () => {
      closeSurvivalWheel()
    }
  }, [])

  const wheelSlots = survivalWheel.slots.map(slot => {
    if (slot.item) {
      return {option: t("item")}
    }
    if (slot.chips) {
      return {option: slot.chips};
    }
  })

  const prizeMessage = () => {
    const wonSlot = survivalWheel.slots[survivalWheel.wonSlotIdx]
    if (wonSlot.item) {
      return (
        <div>
          <TextShadow className={classes.inline}>{t("YouWon")}</TextShadow>
          <div className={classes.iconPrize}>{itemIcon(wonSlot.item.itemId)}</div>
          <TextShadow className={classes.inline}>({wonSlot.item.days} {t("days")}</TextShadow>)
        </div>
      )
    }
    return <TextShadow>{t("YouWon")} {wonSlot.chips} {t("chips")}</TextShadow>
  }

  const goLobby = () => {
    router.push("/lobby/survival")
  }

  if (wheelSlots.length > 1 && survivalWheel.wonSlotIdx !== -1) {
    return (
      <div>
        <div className={classes.wheel}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={survivalWheel.wonSlotIdx}
            data={wheelSlots}
            onStopSpinning={() => {
              setMustSpin(false)
              setSurvivalWheelAction(survivalWheelActions.STOPPING)
              releaseSurvival().catch(backendError)
            }}
            backgroundColors={['rgb(165,13,13)', 'rgb(21,19,19)']}
            textColors={['#ffffff']}
            perpendicularText={true}
            textDistance={60}
            outerBorderColor={'rgb(21,19,19)'}
            outerBorderWidth={20}
            innerBorderColor={'rgb(21,19,19)'}
            innerBorderWidth={20}
            radiusLineColor={'#d9d60e'}
            radiusLineWidth={3}
          />
        </div>

        {
          (!mustSpin && survivalWheelAction === survivalWheelActions.WAITING) &&
          <ShineButton
            className={classes.wheelButton}
            onClick={() => {
              setMustSpin(true)
              setSurvivalWheelAction(survivalWheelActions.ROTATING)
            }}
          >{t("Survival.Spin")}</ShineButton>
        }

        {
          survivalWheelAction === survivalWheelActions.STOPPING &&
          <>
            <Fireworks/>
            <div className={classes.prizeMessage}>{prizeMessage()}</div>
            <ShineButton
              className={classes.wheelButton}
              onClick={goLobby}
            >{t("Go lobby")}</ShineButton>
          </>
        }
      </div>
    )
  }

  return (
    <div className={classes.lossMessage}>
      <TextShadow>{t("DoNotWorry")}</TextShadow>
      <ShineButton onClick={goLobby}>{t("Go lobby")}</ShineButton>
    </div>
  )
}

const mapStateToProps = state => {
  const {news} = state
  return {
    survivalWheel: news.survivalWheel,
    survivalWheelAction: news.survivalWheelAction
  }
}

export default connect(mapStateToProps, {closeSurvivalWheel, setSurvivalWheelAction})(SpinningWheel)