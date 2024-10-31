import Snackbar from "@material-ui/core/Snackbar";
import React from "react";

const AutoAwayNotification = ({onClose, open, children, onClick}) => {
  const handleClose = (event) => {
    onClose(event)
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClick={onClick}
      onClose={handleClose}>
      {children}
    </Snackbar>
  )
}

export default AutoAwayNotification