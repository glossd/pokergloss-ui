import React, {useEffect, useState} from "react";
import {IconButton} from "@material-ui/core";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import {makeStyles} from "@material-ui/core/styles";
import {disableFullScreen, enableFullScreen} from "../util";
import {connect} from "react-redux";
import {setFullscreen} from "../../../redux/actions/table";

const useStyles = makeStyles(() => ({
  fullScreenIcon: {
    color: "#eae6e6",
    '&:hover': {
      color: '#4d84a5',
    }
  },
}));

const FullScreenSwitch = ({isFullscreen, setFullscreen}) => {
  const classes = useStyles();

  const [isFlickering, setFlickering] = useState(false)

  useEffect(() => {
    const width =  window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth
    const height =  window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
    if (width && height && width/height > 2) {
      setFlickering(true)
    }
  }, [])

  function turnOnFullScreen() {
    enableFullScreen()
    setFullscreen(true)
  }

  function turnOffFullScreen() {
    disableFullScreen()
    setFullscreen(false)
  }

  function handleClick() {
    if (isFullscreen) {
      turnOffFullScreen()
    } else if (!isFullscreen) {
      turnOnFullScreen()
    }
  }

  return (
    <IconButton
      color="inherit"
      onClick={handleClick}
    >
      {
        isFullscreen
        ? <FullscreenExitIcon className={classes.fullScreenIcon}/>
        : <FullscreenIcon className={`${classes.fullScreenIcon} ${isFlickering ? "flickering" : ""}`}/>
      }
    </IconButton>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    isFullscreen: tableWS.isFullscreen,
  };
};

export default connect(mapStateToProps, {setFullscreen})(FullScreenSwitch)