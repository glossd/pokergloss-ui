import React, {useEffect, useState} from "react";
import {IconButton} from "@material-ui/core";
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import {makeStyles} from "@material-ui/core/styles";
import Music from "./Music";

const useStyles = makeStyles(() => ({
  reserveIcon: {
    color: "#eae6e6",
    '&:hover': {
      color: '#4d84a5',
    }
  },
}));

const MusicSwitch = ({}) => {
  const classes = useStyles();

  const [isMusicActive, setIsMusicActive] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('table.music.active') === 'false') {
      setIsMusicActive(false)
    } else {
      setIsMusicActive(true)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('table.music.active', isMusicActive.toString());
  }, [isMusicActive])

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={() => isMusicActive ? setIsMusicActive(false) : setIsMusicActive(true)}
      >
        {isMusicActive ?
          <MusicNoteIcon
            className={classes.reserveIcon}
          /> :
          <MusicOffIcon
            className={classes.reserveIcon}
          />
        }
      </IconButton>
      <Music isMusicActive={isMusicActive}/>
    </div>
  )
}

export default MusicSwitch