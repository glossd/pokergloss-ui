import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Navigation from "./Navigation";
import MenuComponent from "./MenuComponent";
import UserInfo from "./UserInfo";
import Daily from "./Daily";
import Messenger from "./Messenger";

const useStyles = makeStyles(() => ({
  appBar: {
    background: '#0a161e',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'spaceBetween',
  },
  menu: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center'
  }
}));

const Header = ({links, analyticsCategory}) => {
  const classes = useStyles();

  return (
    <div>
      <AppBar className={classes.appBar} position="static">
        <Toolbar className={classes.toolBar} >
          <Navigation links={links} analyticsCategory={analyticsCategory}/>
          <div className={classes.menu}>
            <Daily/>
            <Messenger/>
            <UserInfo/>
            <MenuComponent analyticsCategory={analyticsCategory}/>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header
