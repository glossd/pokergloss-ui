import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";
import {Spring, animated, useSpring} from "react-spring";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
    position: 'fixed',
    bottom: '5%',
    left: '1%',
    zIndex: 3,
    width: 600,
  },
  masterPicture: {
    width: 108,
    height: 300,
  },
  message: {
    background: "white",
    borderRadius: "20px",
    color: "#000000",
    fontWeight: "bold",
    padding: 10,
    margin: "5px",
    textAlign: "center",
    fontSize: 20,
    height: 'fit-content',
    '&:after': {
      content: 'close-quote',
      position: 'absolute',
      left: '15%',
      top: '1%',
      width: 0,
      height: 0,
      border: '25px solid transparent',
      borderRightColor: 'white',
      borderLeft: 0,
      borderTop: 0,
      marginTop: '1vw',
      marginLeft: '1vw',
      zIndex: -1
    },
  },
  closeButton: {
    color: 'red',
    position: 'absolute',
    right: '2%',
    top: '2%',
    padding: 0,
  }
}))

const MasterMessage = ({survivalLevel}) => {
  const classes = useStyles()
  const {t} = useTranslation();

  const [message, setMessage] = useState('')
  const [isMasterLeaving, setIsMasterLeaving] = useState(false)

  useEffect(() => {
    if (survivalLevel === 1) {
      updateMessage("Survival.master.paradiseMessage")
    } else if (survivalLevel === 2) {
      updateMessage("Survival.master.spiritWorldMessage")
    } else if (survivalLevel === 4) {
      updateMessage("Survival.master.hellMessage1");
    } else if (survivalLevel === 6) {
      updateMessage("Survival.master.hellMessage2");
    } else if (survivalLevel === 9) {
      updateMessage("Survival.master.hellMessage3");
    }

    function updateMessage(key) {
      const old = sessionStorage.getItem(key)
      if (old) {
        return
      }
      sessionStorage.setItem(key, "true");
      setMessage(key)

      setTimeout(() => {
        closeMessage()
      }, 13000)
    }
  }, [survivalLevel])

  function closeMessage() {
    setIsMasterLeaving(true)
    setTimeout(() => {
      setMessage('')
      setIsMasterLeaving(false)
    }, 2000)
  }

  const leavingAnimation = useSpring({
    opacity: isMasterLeaving ? 0 : 1,
    config: {duration: 2000}
  })

  if (message === '') {
    return <div/>
  }

  return (
    <animated.div style={leavingAnimation} className={classes.root}>
      <Spring
        from={{opacity: .3, x: -500}}
        to={{opacity: 1, x: 0}}
        config={{duration: 4000}}
      >
        {
          props =>
            <animated.span style={props}>
              <img className={classes.masterPicture} src="https://storage.googleapis.com/pokerblow/story/master-1.png" alt=""/>
            </animated.span>
        }
      </Spring>

      <Spring
        from={{opacity: 0}}
        to={[{opacity: 1, delay: 4100}]}
        config={{duration: 1500}}
      >
        {
          props =>
            <animated.span style={props}>
              <div className={classes.message}>
                {t(message)}
              </div>
              <IconButton className={classes.closeButton} onClick={closeMessage}>
                <CloseIcon/>
              </IconButton>
            </animated.span>
        }
      </Spring>
    </animated.div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  return {
    survivalLevel: table.survivalLevel,
  };
};

export default connect(mapStateToProps)(MasterMessage)