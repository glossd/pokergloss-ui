import {makeStyles} from "@material-ui/core/styles";
import React from "react";

const styles = makeStyles(() => ({
  goldButton: {
    position: "relative",
    display: "inline-block",
    boxSizing: "border-box",
    background: "linear-gradient(115deg, #000000, #a37c28, #f6cd35, #dba22d, #b4872a, #000000, #000000, #000000)",
    backgroundSize: "400%",
    minWidth: "fit-content",
    textTransform: "uppercase",
    color: "#ffffff",
    zIndex: 1,
    animation: "$animation 20s linear infinite",
    '&:hover': {
      animation: "$animation 4s linear infinite",
      '&:before': {
        filter: "blur(20px)",
        opacity: 1,
        animation: "$animation 4s linear infinite",
      },
    },
    '&:before': {
      content: "''",
      position: "absolute",
      top: "-5px",
      right: "-5px",
      bottom: "-5px",
      left: "-5px",
      zIndex: -1,
      background: "linear-gradient(115deg, #000000, #a37c28, #f6cd35, #dba22d, #b4872a, #000000, #000000)",
      backgroundSize: "400%",
      opacity: 0,
      transition: ".3s",
    },
    '& > a': {
      color: "#ffffff",
      textDecoration: "none",
    },
    '&:disabled': {
      backgroundSize: "400%",
      background: "linear-gradient(115deg, #000000, #504f4c, #9a9890, #73706a, #635d52, #000000, #000000, #000000)",
      animation: "$animation 20s linear infinite",
      cursor: "not-allowed",
      '&:hover': {
        animation: "$animation 4s linear infinite",
        '&:before': {
          filter: "blur(20px)",
          opacity: 1,
          animation: "$animation 4s linear infinite",
        },
      },
      '&:before': {
        content: "''",
        position: "absolute",
        top: "-5px",
        right: "-5px",
        bottom: "-5px",
        left: "-5px",
        zIndex: -1,
        background: "linear-gradient(115deg, #000000, #504f4c, #9a9890, #73706a, #635d52, #000000, #000000, #000000)",
        backgroundSize: "400%",
        opacity: 0,
        transition: ".3s",
      },
      '& > a': {
        pointerEvents: "none"
      }
    },
  },
  "@keyframes animation": {
    "0%": {
      backgroundPosition: "0%"
    },
    "100%": {
      backgroundPosition: "400%"
    }
  },
}));


const GoldButton = props => {
  const classes = styles()

  return (
    <button
      onClick={props.onClick}
      className={`${classes.goldButton} ${props.className}`}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default GoldButton