import React from "react";

import suitIcon from "./suits";
import Jc from "./people/Jc";
import Qc from "./people/Qc";
import Kc from "./people/Kc";
import Js from "./people/Js";
import Qs from "./people/Qs";
import Ks from "./people/Ks";
import Jd from "./people/Jd";
import Qd from "./people/Qd";
import Kd from "./people/Kd";
import Jh from "./people/Jh";
import Qh from "./people/Qh";
import Kh from "./people/Kh";

const MainContent = ({cardStr, cardWidth, cardHeight, size}) => {
  const width = cardWidth * 0.6
  const height = cardHeight * 0.75
  const face = cardStr.charAt(0)
  const suit = cardStr.charAt(1)

  const levelWidth = width/3
  const levelHeight = height/7
  const rootStyles = () => {
    return {
      width: `${width}vw`,
      height: `${height}vw`,
      marginLeft: `${cardWidth*0.34}vw`,
      marginTop: `${cardHeight*0.15}vw`,
    };
  }
  const pointStyles = (point) => {
    let result = {
      left: `${levelWidth * point.x + levelWidth/2}vw`,
      top: `${levelHeight * point.y + levelHeight/2}vw`,
      height: `${levelHeight*1.4}vw`
    };
    switch (size) {
      case 'big': {
        result.height = `${levelHeight*1.6}vw`
      }
      break
    }

    if (point.z === 0) {
      result.transform = "rotateX(180deg) translate(-50%, 50%)"
    }
    return result
  }

  function getKQJ() {
    switch (cardStr) {
      case "Jc":
        return <Jc className="card-people-picture"/>
      case "Qc":
        return <Qc className='card-people-picture'/>
      case "Kc":
        return <Kc className='card-people-picture'/>
      case "Js":
        return <Js className="card-people-picture"/>
      case "Qs":
        return <Qs className='card-people-picture'/>
      case "Ks":
        return <Ks className='card-people-picture'/>
      case "Jd":
        return <Jd className="card-people-picture"/>
      case "Qd":
        return <Qd className='card-people-picture'/>
      case "Kd":
        return <Kd className='card-people-picture'/>
      case "Jh":
        return <Jh className="card-people-picture"/>
      case "Qh":
        return <Qh className='card-people-picture'/>
      case "Kh":
        return <Kh className='card-people-picture'/>
    }
    console.error("KJQ not found")
    return <div/>;
  }

  switch (face) {
    case "A":
      return (
        <div className={"card-main-content"} style={rootStyles()}>
          {suitIcon(suit,
            {
              left: `${width/3}vw`,
              top: `${height/2}vw`,
              height: `${levelHeight*3}vw`,
            },
            "card-suit")}
        </div>
      )
    case "K":
    case "Q":
    case "J":
      return (
        <div className={"card-main-content"} style={rootStyles()}>
          {getKQJ()}
        </div>
      )
    default:
      return (
        <div className="card-main-content" style={rootStyles()}>
          {coords(cardStr.charAt(0)).map(point => suitIcon(suit, pointStyles(point), "card-suit", point.hashCode()))}
        </div>
      )
  }
}

function coords(face) {
  switch (face) {
    case "2":
      return [c(1, 0, 1), c(1, 6, 0)]
    case "3":
      return [c(1, 3, 1), ...coords("2")]
    case "4":
      return [c(0, 0, 1), c(2, 0, 1), c(0, 6, 0), c(2, 6, 0)]
    case "5":
      return [c(1, 3, 1), ...coords("4")]
    case "6":
      return [c(0, 3, 1), c(2, 3, 1), ...coords("4")]
    case "7":
      return [c(1, 1.5, 1), ...coords("6")]
    case "8":
      return [c(1, 4.5, 0), ...coords("7")]
    case "9":
      return [c(1, 3, 1), ...eightSymols()]
    case "T":
      return [c(1, 1, 1), c(1, 5, 0), ...eightSymols()]
  }
}

function eightSymols() {
  return [c(0, 0, 1), c(2, 0, 1), c(0, 2, 1), c(2, 2, 1), c(0, 4, 0), c(2, 4, 0), c(0, 6, 0), c(2, 6, 0)]
}

function c(x, y, z) {
  return new Point(x, y, z)
}

class Point {
  x // from 0 to 2
  y // from 0 to 6
  z // 0 is down, 1 is up
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  hashCode() {
    return `${this.x}-${this.y}-${this.z}`
  }
}

export default MainContent