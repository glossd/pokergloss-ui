import React from "react";
import HandName from "../HandName/HandName";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: '100%',
    width: "80%"
  }
}))

const HandNamePlate = React.memo(({communityCards, holeCards, isRight, height}) => {
  const classes = useStyles()

  if (!holeCards || holeCards.includes("Xx")) {
    return <div/>
  }
  const allCards = [...communityCards, ...holeCards]
  if (allCards < 3) {
    return <div/>
  }

  const sideShiftCSS = isRight ? {left: `${height/2}vw`} : {}

  return (
    <div className={classes.root} style={sideShiftCSS}>
      <HandName cards={allCards}/>
    </div>
  )
})

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  return {
    communityCards: table.communityCards
  };
};

export default connect(mapStateToProps)(HandNamePlate)
