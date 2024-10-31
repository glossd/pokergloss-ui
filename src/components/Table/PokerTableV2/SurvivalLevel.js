import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

const styles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: '0%',
    background: "rgba(0, 0, 0, 0.9)",
    width: '100%',
    height: '100%',
    textAlign: 'center',
    zIndex: 3,
  },
  level: {
    fontFamily: "'Raleway', serif",
    textTransform: 'uppercase',
    fontSize: '6vw',
    fontWeight: 'bold',
    visibility: 'hidden',
    animation: "$levelAnimation 2s cubic-bezier(.8,0,.2,1)"
  },
  "@keyframes levelAnimation": {
    "0%": {
      opacity: 0.5,
      transform: "translateY(120vh)",
      visibility: "visible"
    },
    "50%": {
      opacity: 1,
      transform: "translateY(40vh)",
    },
    "100%": {
      opacity: 0.5,
      transform: "translateY(-20vh)",
    }
  },
}));

const SurvivalLevel = ({survivalLevel, themeId}) => {
  const classes = styles()

  const [levelState, setLevelState] = useState("start")

  useEffect(() => {
    setLevelState("start")
    setTimeout(() => setLevelState("animation"), 200)
    setTimeout(() => setLevelState("done"), 2300)
  }, [survivalLevel])

  function themeIdStyles() {
    let result = {}
    switch (themeId) {
      case 'paradise':
        result.color = '#5fd9f8'
        break
      case 'spirit-world':
        result.color = '#fefeaa'
        break
      case 'hell':
        result.color = '#e71212'
        break
      default:
        result.color = '#ffffff'
    }
    return result
  }

  return (
    <>
      {
        levelState !== "done" &&
        <div className={classes.root}>
          {levelState === "animation" && <div className={classes.level} style={themeIdStyles()}>Level {survivalLevel}</div>}
        </div>
      }
    </>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  let table = tableWS.table;
  return {
    survivalLevel: table.survivalLevel,
    themeId: table.themeId,
  };
};

export default connect(mapStateToProps)(SurvivalLevel)