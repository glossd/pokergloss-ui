import {getUserPlateDistance, getUserPlateRotateAngle} from "../../util/tableSeatsMath";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import UserPlate from "./UserPlateV2/UserPlate";
import {connect} from "react-redux";

const userPlateCss = (tableSize, position, isMobile) => {
  const rotateAngle = getUserPlateRotateAngle(tableSize, position);
  let distance = getUserPlateDistance(rotateAngle)
  if (isMobile) {
    distance = distance*0.95
  }
  return {
    transform: `rotate(${rotateAngle}deg) translate(${distance}vw) rotate(-${rotateAngle}deg)`
  }
}

const MemoUserPlate = React.memo(({tableSize, position, seat, tableType, pageType, decidingPosition}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const transformCss = React.useMemo(() => userPlateCss(tableSize, position, isMobile), [tableSize, position, isMobile])
  return(
    <div className="user-plate-v2-root" key={seat.position} style={transformCss}>
      <UserPlate seat={seat} position={seat.position} pageType={pageType}
                 tableType={tableType}/>
    </div>
  );
}, (prev, next) => {
  const position = next.position
  if (prev.decidingPosition === position || next.decidingPosition === position) {
    return true
  }
  return prev.seat.player === next.seat.player;
})


const mapStateToProps = state => {
  const { tableWS } = state
  return {
    decidingPosition: tableWS.table.decidingPosition,
  }
};

export default connect(mapStateToProps)(MemoUserPlate)