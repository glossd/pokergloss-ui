import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React from "react";
import ActionButton from "../../../../UI/Button/ActionButton";

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: "10%",
    right: '4%'
  },
}));

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '15%',
    right: '1%',
    width: "12%"
  }
}));

// Only for VIP.
const ShowDownButton = ({onClick}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  return (
    <div className={`${classes.root}`}>
      <ActionButton onClick={onClick}>SHOW RIGHT</ActionButton>
    </div>
  )
}

export default ShowDownButton