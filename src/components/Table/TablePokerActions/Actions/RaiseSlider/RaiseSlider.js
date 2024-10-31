import React, {useEffect} from "react";
import DefaultSlider, {MarkSlider} from "../../../../UI/DefaultSlider/DefaultSlider";
import {connect} from "react-redux";
import {setCpBetting} from "../../../../../redux/actions/table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";
import SVGSlider from "./SVGSlider";
import ScaleSlider from "./ScaleSlider";


const desktopStyles = makeStyles(() => ({
  root: {
    marginLeft: '1vw',
    marginBottom: '1vh',
    width: '100%',
  },
}));

const mobileStyles = makeStyles(() => ({
  root:{
    position: 'absolute',
    right: '7%',
    bottom: '5%',
  },
  value: {
    position: 'absolute',
    top: 0,
    color: 'white'
  }
}));

const portraitStyles = makeStyles(() => ({
  root:{
    position: 'absolute',
    left: '5%',
    bottom: '0%',
    width: "67%"
  }
}));

function RaiseSlider({currentPlayer, min, cpBetting, setCpBetting, totalPot, bettingLimitChips, isSliderHeld}) {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')

  const classes = isMobile ? (isPortrait ? portraitStyles() : mobileStyles()) : desktopStyles()

  useEffect(() => {
    if (cpBetting.chips === 0) {
      setCpBetting(min)
    }
  }, [cpBetting])

  const setValue = (chips) => {
    if (chips >= currentPlayer.stack) {
      setCpBetting(currentPlayer.stack, true)
    } else {
      setCpBetting(chips, false)
    }
  }

  const max = Math.min(currentPlayer.stack, bettingLimitChips - currentPlayer.totalRoundBet);
  return (
    <div className={classes.root} style={{zIndex: isSliderHeld ? 2 : 0}}>
      {
        isMobile
          ?
          isPortrait
            ?
            currentPlayer.stack > totalPot*3
              ?
              <ScaleSlider
                min={min}
                max={max}
                value={cpBetting.chips}
                setValue={setValue}
              />
              : <MarkSlider
                  min={min}
                  max={max}
                  value={cpBetting.chips}
                  onChange={(e, newValue) => setValue(newValue)}
                />
            :
            <SVGSlider
              min={min}
              max={max}
              value={cpBetting.chips}
              setValue={setValue}
              totalRoundBet={currentPlayer.totalRoundBet}
            />
          :
          <DefaultSlider
            min={min}
            max={max}
            value={cpBetting.chips}
            setValue={setValue}
          />
      }
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return {cpBetting: tableWS.cpBetting, bettingLimitChips: tableWS.table.bettingLimitChips,
    totalPot: tableWS.table.totalPot,
    isSliderHeld: tableWS.isSliderHeld};
};

export default connect(mapStateToProps, {setCpBetting})(RaiseSlider)