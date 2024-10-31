import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {withStyles} from "@material-ui/styles";


export const DefaultTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#1f3d54',
    height: '3px',
    '& > span': {
      maxWidth: '50%',
      width: '100%',
      backgroundColor: 'rgb(77 132 165 / 50%)',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);


export const DefaultTab = withStyles(() => ({
  root: {
    textTransform: 'none',
    color: 'rgb(77 132 165)',
    fontWeight: 'normal',
    fontSize: '17px',
    marginRight: '5px',
    backgroundColor: "#0a161e",
    fontFamily: 'Lobster, Georgia, Times, serif',
    '&:hover': {
      color: '#fff',
      opacity: 1,
      backgroundColor: 'rgb(77 132 165 / 50%)',
    },
  },
}))((props) => <Tab disableRipple {...props} />);
