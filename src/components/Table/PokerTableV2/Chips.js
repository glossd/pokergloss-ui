import React from "react";

import Chip from "../../UI/Chip";

const Chips = ({chips, className, dense, widthVW}) => {
  // https://colorscheme.ru/html-colors.html
  const chipColor = (type) => {
    switch (type) {
      case 1: return {center: 'White', side: 'LightSkyBlue'}
      case 5: return {center: 'White', side: 'Crimson'}
      case 25: return {center: 'White', side: 'LimeGreen'}
      case 100: return {center: 'White', side: 'MediumBlue'}
      case 500: return {center: 'White', side: 'Magenta'}
      case 1000: return {center: 'White', side: 'DodgerBlue'}
      case 5000: return {center: 'White', side: 'FireBrick'}
      case 25000: return {center: 'White', side: 'Green'}
      case 100000: return {center: 'White', side: 'Navy'}
      case 500000: return {center: 'White', side: 'DarkMagenta'}
      default: return ''
    }
  }

  const getWidth = () => {
    return widthVW ? widthVW : 2
  }

  const getHeight = () => {
    return getWidth() * 0.75
  }

  const chipTypeDiv = (type, idx) => {
    return (
      <div key={idx} className="poker-chip" style={{zIndex: idx}}>
        <div className='chip-img'>
          <Chip id={type} width={`${getWidth()}vw`} height={`${getHeight()}vw`} sideColor={chipColor(type).side} centerColor={chipColor(type).center}/>
        </div>
      </div>
    )
  }

  const types = [1, 5, 25, 100, 500, 1000, 5000, 25000, 100000, 500000]

  const buildStackList = (chips) => {
    let result = []
    let maxType = 1
    for (const type of types) {
      if (chips >= type) {
        maxType = type
      } else {
        break
      }
    }

    let remainder = chips
    const availableTypes = types.filter(t => t <= maxType).reverse()
    for (const type of availableTypes) {
      let chipsNum = Math.floor(remainder / type)
      if (chipsNum > 0) {
        result.push({type: type, chipsNum: chipsNum})
      }
      remainder %= type
    }
    return result.reverse()
  }

  const adaptStackType = (type) => {
    if (type >= 1000) {
      return type / 1000 + "K"
    }
    return type
  }

  const renderStackList = (numOfChips) => {
    let result = []

    const stackList = buildStackList(numOfChips);

    const typeSize = (type) => {
      switch (type) {
        case 1:
        case 5: return 'poker-chip-type-with-one-symbol'
        case 25:
        case 1000:
        case 5000: return 'poker-chip-type-with-two-symbols'
        case 100:
        case 500:
        case 25000: return 'poker-chip-type-with-three-symbols'
        case 100000:
        case 500000: return 'poker-chip-type-with-four-symbols'

        default: return 'poker-chip-type-with-four-symbols'
      }
    }

    const typeToSize = (type) => {
      let size = 0
      let top = 0
      switch (type) {
        case 1:
        case 5:
          size = getWidth()/2
          break
        case 25:
        case 1000:
        case 5000:
          size = getWidth()/200*86
          break
        case 100:
        case 500:
        case 25000:
          size = getWidth()/200*86
          top = size/13
          break
        case 100000:
        case 500000:
        default:
          size = getWidth()/4
          top = size/2
          break
      }
      return {fontSize: `${size}vw`, marginTop: `-${size/10}vw`, width: `${getWidth()}vw`, height: `${getHeight()}vw`}
    }

    let zIndex = 0
    for (let i = 0; i < stackList.length; i++) {
      let stack = stackList[i]
      let chipDivs = []
      let zIndexChipTypeNum = zIndex + stack.chipsNum + 1;
      chipDivs.push((
        <div key={zIndexChipTypeNum} className={`poker-chip-type-number`} style={Object.assign(typeToSize(stack.type), {zIndex: zIndexChipTypeNum})}>
          {adaptStackType(stack.type)}
        </div>
      ))
      for (let i = stack.chipsNum; i > 0; i--) {
        chipDivs.push(chipTypeDiv(stack.type, zIndex + i))
      }
      zIndex += stack.chipsNum
      result.push((
        <div className={"stack-chips"} key={i}>{chipDivs}</div>
      ))
    }
    return result
  }

  if (!chips) {
    return <div/>
  }

  return (
    <div className={`list-stack-chips ${className?className:""}`} style={dense && {flexWrap: 'wrap', width: '2vw'}}>
      {renderStackList(chips)}
    </div>
  )
}

export default Chips