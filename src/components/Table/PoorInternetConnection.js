import React, {useState} from "react";
import PermScanWifiIcon from '@material-ui/icons/PermScanWifi';
import {makeStyles} from "@material-ui/core/styles";
import {animated, useSpring} from 'react-spring'

const useStyles = makeStyles(() => ({
  root: {
    padding: '12px',
  },
  icon: {
    color: "#ff0000",
  },
}));

const PoorInternetConnection = ({}) => {
  const classes = useStyles()

  const [flip, set] = useState(false)
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
    reverse: flip,
    delay: 200,
    onRest: () => set(!flip),
  })

  return (
    <div className={classes.root}>
      <animated.div style={props}><PermScanWifiIcon className={classes.icon}/></animated.div>
    </div>
  )
}

export default PoorInternetConnection