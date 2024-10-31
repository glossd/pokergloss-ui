import React, {useEffect} from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PersonIcon from "@material-ui/icons/Person";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SettingsIcon from "@material-ui/icons/Settings";
import HistoryIcon from "@material-ui/icons/History";
import StarIcon from "@material-ui/icons/Star";
import SchoolIcon from '@material-ui/icons/School';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DefaultButton from "../UI/Button/DefaultButton/DefaultButton";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import {evictLogOut} from "../../redux/actions/auth";
import {setBalance, setExp} from "../../redux/actions/news";
import {setProfileUsername} from "../../redux/actions/profile";
import {getBalance} from "../../backend/bank";
import {backendError} from "../../backend/error";
import {getMyExp} from "../../backend/achievement";
import {getCurrentUser, logout} from "../../auth/Firebase";
import * as ReactGA from "react-ga";

const useStyles = makeStyles(() => ({
  menuIcon: {
    color: 'white',
    backgroundColor: '#23475e',
    width: '40px',
    height: '40px',
    borderRadius: '30%',
    marginLeft: '12px'
  },
  icon: {
    '&:hover': {
      color: '#8ab8c9',
    },
  },
  headerMenuItem: {
    backgroundColor: '#0a161e',
    color: 'white',
    fontFamily: 'Lobster, Georgia, Times, serif',
    '&:hover': {
      backgroundColor: '#172b37',
      color: '#8ab8c9',
    },
  },
}));


const MenuComponent = ({isAuthenticated, isAnonymous, balance, setBalance, exp, setExp, analyticsCategory, evictLogOut}) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (isAuthenticated && !isAnonymous) {
      if (balance == null) {
        getBalance()
          .then(data => setBalance(data))
          .catch(backendError)
      }
      if (exp === null) {
        getMyExp()
          .then(data => {
            setExp(data)
          })
          .catch(backendError)
      }
    }
  }, [isAuthenticated, isAnonymous])

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const logoutUser = () => {
    logout().then(() => {
      evictLogOut()
      router.push("/")
    })
  }

  const handleOpenProfile = () => {
    getCurrentUser()
      .then(user => {
        setProfileUsername(user.displayName)
        router.push(`/u/${user.displayName}`)
      })
  }

  const handleOpenInventory = () => {
    router.push("/inventory")
  }

  const handleOpenMarket = () => {
    router.push("/market/items")
  }

  const handleOpenSettings = () => {
    router.push("/settings")
  }

  const handleOpenChipHistory = () => {
    router.push("/bank/history")
  }

  const handleOpenRating = () => {
    router.push("/rating")
  }

  const handleOpenTutorial = () => {
    router.push("/tutorial")
  }

  const onSignIn = () => {
    if (analyticsCategory) {
      ReactGA.event({
        category: analyticsCategory,
        action: "Header sign in",
      });
    }
    router.push("/signin")
  }

  return (
    <>
      {isAuthenticated && !isAnonymous ?
        <div>
          <IconButton className={classes.menuIcon} onClick={openMenu} edge="end">
            <MenuIcon className={classes.icon}/>
          </IconButton>

          <Menu
            style={{top: '49px'}}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeMenu}
          >
            <MenuItem onClick={handleOpenProfile} className={classes.headerMenuItem}><PersonIcon/> {t("Header.Menu.Profile")}</MenuItem>
            <MenuItem onClick={handleOpenInventory} className={classes.headerMenuItem}><BusinessCenterIcon/> {t("Header.Menu.Inventory")}</MenuItem>
            <MenuItem onClick={handleOpenMarket} className={classes.headerMenuItem}><ShoppingCartIcon/> {t("Header.Menu.Market")}</MenuItem>
            <MenuItem onClick={handleOpenSettings} className={classes.headerMenuItem}><SettingsIcon/> {t("Header.Menu.Settings")}</MenuItem>
            <MenuItem onClick={handleOpenChipHistory} className={classes.headerMenuItem}><HistoryIcon/> {t("Header.Menu.History")}</MenuItem>
            <MenuItem onClick={handleOpenRating} className={classes.headerMenuItem}><StarIcon/> {t("Header.Menu.Rating")}</MenuItem>
            <MenuItem onClick={handleOpenTutorial} className={classes.headerMenuItem}><SchoolIcon/> {t("Header.Menu.Tutorial")}</MenuItem>
            <MenuItem onClick={logoutUser} className={classes.headerMenuItem}><ExitToAppIcon/> {t("Header.Menu.Logout")}
            </MenuItem>
          </Menu>
        </div> :
        <div>
          <DefaultButton onClick={onSignIn}>{t("Header.SignIn")}</DefaultButton>
        </div>}
    </>
  )
}

const mapStateToProps = state => {
  const {auth, news} = state
  return {
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
    balance: news.balance,
    exp: news.exp,
  };
};

export default connect(mapStateToProps, {evictLogOut, setBalance, setExp, setProfileUsername})(MenuComponent)