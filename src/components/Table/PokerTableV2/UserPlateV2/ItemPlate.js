import React from "react";
import {itemIcon, itemPosition, side, top} from "../../../market/itemStore";
import {makeStyles} from "@material-ui/core/styles";

const itemWidth = 4
const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: itemWidth+'vw',
    height: itemWidth+'vw',
    bottom: '-15%',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
  }
}))

const ItemPlate = React.memo(({marketItemId, isRight, height, width}) => {
  const classes = useStyles()
  if (!marketItemId) {
    return <div/>
  }

  const sidePositionCSS = isRight ? {
    left: `${height-1}vw`
  } : {
    left: `${width-height-itemWidth+1}vw`
  }

  const topPositionCSS = isRight ? {
    left: `${(height-itemWidth)/2}vw`,
    top: `${-height/2}vw`
  } : {
    left: `${width-(height+itemWidth)/2}vw`,
    top: `${-height/2}vw`
  }

  const position = itemPosition(marketItemId)
  let css = {}
  if (position === side) {
    css = sidePositionCSS
  } else if (position === top) {
    css = topPositionCSS
  }

  return (
    <div className={classes.root} style={css}>
      {itemIcon(marketItemId)}
    </div>
  )
})

export default ItemPlate
