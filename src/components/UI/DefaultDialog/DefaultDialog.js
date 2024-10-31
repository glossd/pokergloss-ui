import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  dialogTitle: {
    backgroundColor: 'black',
    color: '#8e8989',
  },
  dialogContent: {
    backgroundColor: 'black',
    color: 'white',
    padding: '18px',
  },
  dialogAction: {
    backgroundColor: 'black',
    color: 'white',
  },
  actionButton: {
    color: 'white',
    background: '#008000',
    width: '250px',
  },
  actionButtonDisabled: {
    backgroundColor: '#8e8989',
    width: '250px',
  },
  cancelButton: {
    color: 'white',
    background: '#1f3192',
    width: '250px',
  },
}))

const DefaultDialog = ({title, cancel, action, children, ...props}) => {
  const classes = useStyles()
  return (
    <div>
      <Dialog {...props} maxWidth={'md'}>
        {title && <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>}
        <DialogContent className={classes.dialogContent}>
          {children}
        </DialogContent>
        <DialogActions className={classes.dialogAction}>
          {cancel && <Button className={classes.cancelButton} onClick={cancel.onClick}>{cancel.text}</Button>}
          {
            action &&
            <Button
              className={action.disabled ? classes.actionButtonDisabled : classes.actionButton}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.text}
            </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DefaultDialog