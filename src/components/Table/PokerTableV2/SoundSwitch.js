import {IconButton} from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Sounds from "./Sounds";

const useStyles = makeStyles(() => ({
  reserveIcon: {
    color: "#eae6e6",
    '&:hover': {
      color: '#4d84a5',
    }
  },
}));

const SoundSwitch = () => {
  const classes = useStyles();

  const [isSoundActive, setIsSoundActive] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('table.sound.active') === 'false') {
      setIsSoundActive(false)
    } else {
      setIsSoundActive(true)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('table.sound.active', isSoundActive.toString());
  }, [isSoundActive])

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={() => isSoundActive ? setIsSoundActive(false) : setIsSoundActive(true)}
      >
        {isSoundActive ?
          <VolumeUpIcon
            className={classes.reserveIcon}
          /> :
          <VolumeOffIcon
            className={classes.reserveIcon}
          />
        }
      </IconButton>
      <Sounds isSoundActive={isSoundActive}/>
    </div>
  )
}

export default SoundSwitch