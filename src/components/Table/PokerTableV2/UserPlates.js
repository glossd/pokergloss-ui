import React from "react";
import {getUserPlateDistance, getUserPlateRotateAngle} from "../../util/tableSeatsMath";
import {connect} from "react-redux";
import UserPlate from "./UserPlateV2/UserPlate";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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

const MemoUserPlate = React.memo(({tableSize, position, seat, tableType, pageType}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const transformCss = React.useMemo(() => userPlateCss(tableSize, position, isMobile), [tableSize, position, isMobile])
  return(
    <div className="user-plate-v2-root" key={seat.position} style={transformCss}>
      <UserPlate seat={seat} position={seat.position} pageType={pageType}
                          tableType={tableType}/>
    </div>
  );
});

const UserPlates = ({table, pageType}) => {
  if (!table.seats || !table.seats.length) {
    return <div/>
  }
  return table.seats.map(seat => {
    return (
        <MemoUserPlate key={seat.position} tableSize={table.size} seat={seat} position={seat.position}
                       tableType={table.type} pageType={pageType}
        />
    )
  })
}

const mapStateToProps = state => {
  const { tableWS } = state
  return { table: tableWS.table};
};

export default connect(mapStateToProps)(UserPlates)