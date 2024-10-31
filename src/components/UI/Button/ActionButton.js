import React from 'react'
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const desktopStyles = makeStyles(() => ({
  actionBtn: {
    width: "100%",
    fontSize: "2vh",
    maxHeight: "4.5vh"
  }
}))

const mobileStyles = makeStyles(() => ({
  actionBtn: {
    width: "100%",
  }
}))

const ActionButton = ({onClick, className, disabled, children}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  return (
    <Button
      onClick={onClick}
      className={`${className} ${classes.actionBtn}`}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}

export default ActionButton