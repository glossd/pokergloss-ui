import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ActionButton from "../../../../UI/Button/ActionButton";

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    width: "15%",
    right: '25%',
  },
  vipRoot: {
    width: "10%",
    right: "40%"
  }
}));

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    bottom: '55%',
    right: '1%',
    width: "12%"
  },
  vipRoot: {
    bottom: "75%"
  }
}));

const ShowDownButton = ({onClick, isVip}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  return (
    <div className={`${classes.root} ${isVip ? classes.vipRoot : {}}`}>
      <ActionButton onClick={onClick}>MUCK</ActionButton>
    </div>
  )
}

export default ShowDownButton