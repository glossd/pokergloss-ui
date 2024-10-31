import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from "@material-ui/lab/AlertTitle";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function GreenNotification({open, onClose, onAction, notificationIcon, actionIcon, title, description}) {
  const handleAction = () => {
   onAction()
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose(event)
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={handleClose}>
      <Alert
        severity="success"
        onClose={handleClose}
        icon={notificationIcon}
      >
        <AlertTitle>{title}</AlertTitle>
        <div style={{width: "100%", minWidth: "230px", display:"flex", justifyContent: "space-between"}}>
          <div>{description}</div>
          {
            actionIcon &&
            <IconButton style={{marginTop: "-15%"}} onClick={handleAction}>
              {actionIcon}
            </IconButton>
          }
        </div>
      </Alert>
    </Snackbar>
  );
}

export default GreenNotification