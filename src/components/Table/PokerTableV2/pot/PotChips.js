import Chips from "../Chips";
import {adaptChipsToBB} from "../../util";
import React from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  potChipsRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column'
  }
}))

const PotChips = ({chips, widthVW, isChipsInBB, bigBlind, className}) => {
  const classes = useStyles()
  const labelStyles = () => {
    if (widthVW) {
      return {zIndex: chips + 1, marginTop: `${widthVW-2}vw`, marginLeft: `${widthVW/4}vw`, fontSize: `${widthVW/2}vw`}
    }
    return {zIndex: chips + 1};
  }
  return (
    <div className={`${className} ${classes.potChipsRoot}`}>
      <Chips chips={chips} widthVW={widthVW}/>
      <span className="chips-background" style={labelStyles()}>{isChipsInBB ? adaptChipsToBB(chips, bigBlind) : chips}</span>
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    isChipsInBB: tableWS.isChipsInBB,
    bigBlind: tableWS.table.bigBlind,
  };
};

export default connect(mapStateToProps)(PotChips)
