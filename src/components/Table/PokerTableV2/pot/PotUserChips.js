import React from "react";
import {getPotDistance, getUserPlateRotateAngle, toCoordinates} from "../../../util/tableSeatsMath";
import PotChips from "./PotChips";
import {connect} from "react-redux";

const PotUserChips = React.memo(({tableSize, position, chips, className}) => {
  const angle = getUserPlateRotateAngle(tableSize, position)
  const distance = getPotDistance(angle)
  const {x, y} = toCoordinates(angle, distance)

  return (
    <div style={{transform: `translate3d(${x}vw, ${y}vw, 0)`}} className={className}>
      <PotChips chips={chips}/>
    </div>
  )
})

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    tableSize: tableWS.table.size,
  };
};

export default connect(mapStateToProps)(PotUserChips)
