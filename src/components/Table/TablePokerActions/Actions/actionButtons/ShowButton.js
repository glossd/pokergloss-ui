import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ActionButton from "../../../../UI/Button/ActionButton";

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: "15%",
    right: '5%',
  },
  vipRoot: {
    width: "10%",
    right: '28%',
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '35%',
    right: '1%',
    width: "12%"
  },
  vipRoot: {
    bottom: "58%"
  }
}));

const ShowDownButton = ({onClick, isVip}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  return (
    <div className={`${classes.root} ${isVip ? classes.vipRoot : {}}`}>
      <ActionButton onClick={onClick}>SHOW</ActionButton>
    </div>
  )
}

export default ShowDownButton