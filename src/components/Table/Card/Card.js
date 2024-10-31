import React, {useState} from "react";


import MainContent from "./MainContent";
import suitIcon from "./suits";

/**
 * @param cardStr e.g 'Kh' '2d' 'Ts'
 * @param size options are `normal` and `big`
 * @param face options are `down` and `up`
 * @param timeToOpen time
 */
const Card = ({cardStr, size = "normal", widthVW, cardFace = 'down', timeToOpen = 0, isMoveUp = false, isShadow = false}) => {

  const [face, setFace] = useState(cardFace)
  if (timeToOpen > 0 && cardStr !== 'Xx') {
    setTimeout(() => setFace("up"), timeToOpen)
  }

  let faceSymbol = cardStr.charAt(0)
  let shortSuit = cardStr.charAt(1)

  const computeHeight = width => width/4*5.5

  let width = 4.5
  if (widthVW) {
    width = widthVW
  } else {
    switch (size) {
      case 'super-big':
        width = 6.5
        break
      case 'big': {
        width = 5.5
        break
      }
      case 'normal-big': {
        width = 5
        break
      }
      case 'little': {
        width = 3
        break
      }
    }
  }
  const height = computeHeight(width)

  let cardClassName = `card card-size-${size}`

  if (faceSymbol === 'T') {
    faceSymbol = '10'
  }

  const cardSizeStyle = () => {
    return {
      width: `${width}vw`,
      height: `${height}vw`,
    }
  }

  function faceColor(shortSuit) {
    switch (shortSuit) {
      case "d": return 'diamonds-color'
      case "h": return 'hearts-color'
      case "s": return 'spades-color'
      case "c": return 'clubs-color'
      default: return "unknown"
      }
  }

  const additionalSuitStyles = () => {
    return {
      left: width/7+"vw",
      top: height/2.5+'vw',
      height: height/5+'vw',
    }
  }

  const faceSymbolStyles = (faceSymbol) => {
    let result = {
      position: 'absolute',
      whiteSpace: 'pre',
      marginLeft: '0.2vw',
      lineHeight: '0.9',
      fontWeight: 'bold',
      fontFamily: 'Times, serif',
      fontSize: height/3.2+'vw',
    }

    switch (faceSymbol) {
      case '10': {
        result.marginLeft = '-0.09vw'
        result.letterSpacing = '-0.3vw'
        break
      }
      case 'Q':
      case 'K': {
        result.marginLeft = '-0.05vw'
        break
      }
      case 'A': {
        result.marginLeft = '-0.01vw'
        break
      }
      default: {
        break
      }
    }

    return result
  }

  const xxCard = (
    <div style={cardSizeStyle()} className={`secret-card ${cardClassName}`}>
      <img style={cardSizeStyle()} src="https://storage.googleapis.com/pokerblow/poker-table/Xx.png" alt="sc"/>
    </div>
  )

  if (cardStr === 'Xx') {
    return xxCard
  } else {
    return (
      <div style={cardSizeStyle()} className={`flip-card`}>
        <div className={`flip-card-inner ${face === 'up' ? 'do-flip-card' : ''}`}>
          <div className="flip-card-front">
            {xxCard}
          </div>
          <div className="flip-card-back">
            <div style={cardSizeStyle()}
                 className={`${cardClassName} ${isMoveUp ? 'is-move-up' : ""} ${isShadow ? 'is-shadow' : ""}`}>
              <div style={faceSymbolStyles(faceSymbol)}
                   className={`${faceColor(shortSuit)}`}>{faceSymbol}</div>
              {suitIcon(shortSuit, additionalSuitStyles(), "additional-suit")}
              <MainContent cardWidth={width} cardHeight={height} cardStr={cardStr} size={size}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export function suitImage(suit) {
  return `https://cdn.rawgit.com/jedgek/49eacfbeffbb1d69ffd1cbdbda75271f/raw/b79cc961ca287467bab1787fba54502aea02b605/deckofcards.svg#${suiteFullName(suit)}`
}

function suiteFullName(shortSuit) {
  switch (shortSuit) {
    case "d": return 'diamonds'
    case "h": return 'hearts'
    case "s": return 'spades'
    case "c": return 'clubs'
    default: return "unknown"
  }
}

export default Card