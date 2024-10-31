import React, {useEffect, useState} from "react";
import {ClickAwayListener} from "@material-ui/core";
import {getUserStatistics} from "../../../../backend/achievement";
import {backendError} from "../../../../backend/error";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  infoContainer: {
    background: '#000000',
    color: '#ffffff',
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: '30%/100%',
    border: 'solid 1px #3c413f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  InfoLinesContainer: {
    width: '100%'
  },
  infoLine: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  }
}))

const ProfilePopover = React.memo(({username, userId, height}) => {
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = useStyles()

  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false)
  const [userStatistics, setUserStatistics] = useState(null)

  useEffect(() => {

    if (isProfileInfoOpen) {
      getUserStatistics(userId)
        .then(data => {
          setUserStatistics(data)
        })
        .catch(backendError)
    }
  }, [isProfileInfoOpen])

  const handleClickAway = () => {
    setIsProfileInfoOpen(false);
  };

  const profileLink = () => {
    if (!isMobile) {
      return <a target="_blank" href={`/u/${username}`}>&#10551;</a>
    } else {
      return <div/>
    }
  }

  const infoContainerCSS = () => {
    let css = {fontSize: `${height / 4.5}vw`}
    if (!isProfileInfoOpen) {
      css.opacity = 0
    }
    return css
  }

  return (
    <div>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div style={infoContainerCSS()} className={classes.infoContainer} onClick={() => setIsProfileInfoOpen(true)}>
          {
            isProfileInfoOpen &&
            <div className={classes.InfoLinesContainer}>
              {
                userStatistics &&
                <div className={classes.InfoLinesContainer}>
                  <div className={classes.infoLine}>
                    <div>{username} {profileLink()}</div>
                  </div>
                  <div className={classes.infoLine}>
                    <div>{t("table.ProfileInfo.Won")} {userStatistics.winPercent}%,</div>
                    <div>All-in: {userStatistics.allInPercent}%,</div>
                  </div>
                  <div className={classes.infoLine}>
                    <div>{t("table.ProfileInfo.Games")} {userStatistics.gameCount},</div>
                    <div>Fold: {userStatistics.foldPercent}%</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </ClickAwayListener>
    </div>
  )
})

export default ProfilePopover