import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {setIsSliderHeld} from "../../../../../redux/actions/table";
import {connect} from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    width: "20vw",
    height: "90vh",
    position: "relative",
  },
  sliderContainer: {
    width: "100%",
    "& #svg-slider-range": {
      width: "60%",
      height: "80%",
      position: "absolute",
      top: "10%",
      left: "70%",
      opacity: 0,
      zIndex: 1,
      appearance: "slider-vertical",
      webkitAppearance: "slider-vertical"
    },
    "& #svg-container": {
      position: "absolute",
      bottom: "15%",
      transform: "rotate(180deg)",
      webkitTransform: "rotate(180deg)",
      overflow: "visible",
      height:"85%",
      width:"100%"
    },
  },
  valueNumber: {
    position: "absolute",
    top: "-2%",
    right: "-20%",
    color: "#fff",
    fontSize: 40,
  }
}))

const SVGSlider = ({min, max, value, setValue, totalRoundBet, isSliderHeld, setIsSliderHeld}) => {
  const classes = useStyles()

  const curve = {
    x: 0,
    y: 0,
    cpx: 100,
    cpy: 150,
    endx: 100,
    endy: 260
  }

  let percent = 0.1
  let rangeElement
  let curveElement
  let thumbElement

  useEffect(() => {
    if (typeof window === 'object') {
      curveElement = document.getElementById('svg-slider-curve')
      thumbElement = document.getElementById('svg-slider-thumb')
      rangeElement = document.getElementById('svg-slider-range')

      rangeElement.value = percent * 100
      rangeElement.addEventListener('input', moveThumb)

      drawCurve()
      drawThumb(percent)
    }
  }, [])

  const getQuadraticBezierXYatPercent = (curve, percent) => {
    let x = Math.pow(1 - percent, 2) * curve.x + 2 * (1 - percent) * percent
      * curve.cpx + Math.pow(percent, 2) * curve.endx
    let y = Math.pow(1 - percent, 2) * curve.y + 2 * (1 - percent) * percent
      * curve.cpy + Math.pow(percent, 2) * curve.endy

    return { x, y }
  }

  const drawCurve = () => {
    curveElement.setAttribute(
      'd',
      `M${curve.x},${curve.y} Q${curve.cpx},${curve.cpy} ${curve.endx},${curve.endy}`
    )
  }

  const drawThumb = (percent) => {
    let point = getQuadraticBezierXYatPercent(curve, percent)
    thumbElement.setAttribute('cx', point.x)
    thumbElement.setAttribute('cy', point.y)
  }

  const moveThumb = e => {
    const value = Number(e.target.value)
    percent = value / (max - min)
    setValue(min + value)
    drawThumb(percent)
  }

  const onTouchMove = () => {
    setIsSliderHeld(true)
  };
  const onTouchEnd = () => {
    rangeElement = document.getElementById('svg-slider-range')
    rangeElement.value = min
    setIsSliderHeld(false)
  };

  return (
    <div
      className={classes.root}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={classes.sliderContainer}>

        <input id="svg-slider-range" type="range" min={0} max={max-min}/>

        <svg id="svg-container">
          <path
            id="svg-slider-curve"
            stroke={"rgba(255,255,255,0.3)"}
            fill="none"
            strokeWidth="40"
            strokeLinecap="round"
            display={isSliderHeld ? "block" : "none"}
          />

          <circle
            id="svg-slider-thumb"
            stroke={"#ffffff"}
            strokeWidth={5}
            fill={'#41981c'}
            opacity={isSliderHeld ? 1 : 0}
            r="25"
          />

          <circle
            name={"fake-thumb"}
            stroke={"#3a8619"}
            strokeWidth={5}
            fill={"none"}
            opacity={isSliderHeld ? 0 : 1}
            r="25"
          />
        </svg>
      </div>

      <div className={classes.valueNumber} style={{opacity: isSliderHeld ? 1 : 0}}>
        {value + totalRoundBet}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  return {
    isSliderHeld: tableWS.isSliderHeld
  }
};

export default connect(mapStateToProps, {setIsSliderHeld})(SVGSlider)