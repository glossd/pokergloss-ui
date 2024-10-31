import React from "react";
import {IconButton} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {useRouter} from "next/router";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  backIcon: {
    color: "#eae6e6",
    '&:hover': {
      color: '#4d84a5',
    }
  },
}));

const BackToLobby = ({}) => {
  const classes = useStyles();
  const router = useRouter()

  const backToLobby = () => {
    router.push("/lobby/live")
  }

  return (
    <IconButton
      color="inherit"
      onClick={() => backToLobby()}
    >
      <ExitToAppIcon
        className={classes.backIcon}
      />
    </IconButton>
  )
}



export default BackToLobby