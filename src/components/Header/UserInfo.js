import React, {useEffect, useRef} from "react";
import {currentUserAvatarUrl} from "../../auth";
import {connect} from "react-redux";

import {Spring, animated} from "react-spring";
import LevelProgress from "./LevelProgress";
import {makeStyles} from "@material-ui/core/styles";
import {Popover} from "@material-ui/core";
import {useTranslation} from "next-i18next";
import Coin from "../UI/Coin";
import {Add} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {useRouter} from "next/router";
import ChipIcon from "../UI/ChipIcon";

const useStyles = makeStyles(() => ({
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: '10px',
  },
  balance: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '18px',
    flexDirection: "column"
  },
  goldenCoin: {
    width: '20px',
    height: '20px',
    display: "inline-block",
    marginRight: '2px'
  },
  buyCoinsBtn: {
    padding: 0,
    color: "white",
    backgroundColor: "#206073",
    marginLeft: '2px'
  },
  redChip: {
    width: '20px',
    height: '20px',
    marginRight: '2px'
  },
  chips:{
    display: "inline-block"
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%'
  },
  level: {
    top: '25px',
    left: '28px',
    fontSize: '15px',
    minWidth: '20px',
    borderRadius: '10px',
  },
  popover: {
    pointerEvents: 'none',
  },
}))

const UserInfo = ({exp, chips, coins, isAuthenticated, isAnonymous}) => {
  const {t} = useTranslation();
  const classes = useStyles()
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const prevChips = usePrevious(chips);
  const openPopover = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  function chipsColorCss() {
    if (prevChips == null) {return "#FFFFFF"}
    if (chips > prevChips) {return "#1AD420";}
    if (chips < prevChips) {return "#B11429"}
    return "#FFFFFF"
  }

  if (isAnonymous) {
    return <div/>
  }

  if (!isAuthenticated) {
    return <div/>
  }

  return (
    <div>
      <div
        className={classes.userInfo}
        aria-owns={openPopover ? 'user-info-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <div className={classes.avatarContainer}>
          <img className={classes.avatar} src={currentUserAvatarUrl()} alt='avatar'/>
          {exp && <div className={`navbar-user-avatar-level-common ${classes.level}`}>{exp.level}</div>}
          {exp && <LevelProgress exp={exp}/>}
        </div>

        <div className='navbar-user-info-column-container'>
          {chips >= 0 ?
            <div className={classes.balance}>
              <div>
                <div className={classes.goldenCoin}><Coin/></div>
                <span>{coins}</span>
                <IconButton size={"small"} className={classes.buyCoinsBtn} onClick={() => {router.push("/coins")}}>
                  <Add fontSize={"small"}/>
                </IconButton>
              </div>
              <div>
                <ChipIcon className={classes.redChip}/>
                <Spring
                  reset={true}
                  from={{bal: prevChips == null ? chips : prevChips, color: chipsColorCss()}}
                  to={{bal: chips, color: '#FFFFFF'}}
                >
                  {style => <animated.div className={classes.chips} style={{color: style.color}}>
                    {style.bal
                      ? style.bal.interpolate(v => Math.floor(v))
                      : 0}
                  </animated.div>}
                </Spring>
              </div>
            </div> :
            <div style={{height: '2vw'}}/>}

        </div>
      </div>

      <Popover
        className={classes.popover}
        id="user-info-popover"
        open={openPopover}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {exp &&
        <div className='tooltip-user-info'>
          <div><span style={{fontWeight: 'bold'}}>{t("Header.Tooltip.Level")}:</span> <span
            style={{color: '#67e207'}}>{exp.level}</span>, {exp.points}/{exp.nextLevelPoints} XP
          </div>
          <div>{exp.nextLevelPoints - exp.points} {t("Header.Tooltip.LeftToTheNextLevel")}</div>
        </div>}
      </Popover>
    </div>
  )
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const mapStateToProps = state => {
  const {news, auth} = state
  const b = news.balance;
  return {
    chips: b == null ? null : b.chips,
    coins: b == null ? null : b.coins,
    exp: news.exp,
    isAuthenticated: auth.isAuthenticated,
    isAnonymous: auth.isAnonymous,
  };
};

export default connect(mapStateToProps)(UserInfo)