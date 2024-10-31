import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {connect} from "react-redux";
import {
  EventsTableEventTypeEnum,
  ModelPlayerLastGameActionEnum,
  ModelTableStatusEnum,
  ModelTableTypeEnum
} from "@pokergloss/table-client-typescript";
import {IconButton} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import {registerForSitngo, reserveSeat} from "../../../../backend/table";
import {backendError} from "../../../../backend/error";
import {useRouter} from "next/router";
import SignInDialog from "../SignInDialog/SignInDialog";
import ProfilePopover from "./ProfilePopover";
import PlayerInfoPlate from "./playerInfoPlate/PlayerInfoPlate";
import HoleCards from "./HoleCards";
import AvatarPlate from "./AvatarPlate";
import HandNamePlate from "./HandNamePlate";
import TimeoutBarPlate from "./TimeoutBarPlate";
import Bet from "./Bet";
import ChatMessagePlate from "./ChatMessagePlate";

import ItemPlate from "./ItemPlate";
import EmojiPlate from "./EmojiPlate";


const height = 5
const width = 14
const desktopMobileRatio = 1.2
const heightForMobile = height*desktopMobileRatio
const widthForMobile = width*desktopMobileRatio

const desktopStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    height: `${height}vw`,
    width: `${width}vw`,
    top: `-${height/2}vw`
  },
  rightPlateShift: {
    left: `-${height/2}vw`
  },
  leftPlateShift: {
    left: `-${width - height/2}vw`
  },
}))

const mobileStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    height: `${heightForMobile}vw`,
    width: `${widthForMobile}vw`,
    top: `-${heightForMobile/2}vw`
  },
  rightPlateShift: {
    left: `-${heightForMobile/2}vw`
  },
  leftPlateShift: {
    left: `-${widthForMobile - heightForMobile/2}vw`
  },
}))

const commonStyles = makeStyles(() => ({
  transformToCenter : {
    position: 'absolute',
    transform: 'translate(-50%, -50%)'
  },
  reserveButton: {
    background: '#172b37',
    borderRadius: '30%',
    border: 'solid white 2px',
    '&:hover': {
      background: '#4d84a5',
    }
  },
  reserveIcon: {
    color: "#eae6e6",
    fontSize: '2vw',
    position: 'relative',
    right: '12%',
    '&:hover': {
      color: '#eae6e6',
    }
  }
}))

const UserPlate = ({
                     seat, currentUserPosition, tableType, pageType, tableId, tableStatus, isOffline,
                     position, isAuthenticated, isEmailVerified, tableSize,
}) => {

  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const classes = isMobile ? mobileStyles() : desktopStyles()
  const commonClasses = commonStyles()
  const router = useRouter();

  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false)

  const isRight = () => position < Math.ceil(tableSize / 2)
  const isFolded = () => playerOrEmpty().lastGameAction === ModelPlayerLastGameActionEnum.Fold
  const getHeight = () => isMobile ? heightForMobile : height
  const getWidth = () => isMobile ? widthForMobile : width

  // mock
  // seat.player = {position, totalRoundBet: 50, userId:position, username:position, blind: "dealer"}

  const playerOrEmpty = () => seat.player ? seat.player : {}

  const isSeatFree = () => !seat.player

  const isSittingOut = () => playerOrEmpty().status === "sittingOut"
  const sittingOutClass = () => (isSittingOut()?"grey-scale":"")

  const handleReserve = (position) => {
    if (!isAuthenticated) {
      setIsRedirectDialogOpen(true)
      return
    }

    if (!isEmailVerified) {
      router.push("/verify-email")
      return
    }

    switch (pageType) {
      case "table":
        reserveSeat(tableId, position)
          .catch(backendError)
        break
      case "sitngo":
        registerForSitngo(tableId, position)
          .catch(backendError)
        break
    }
  }

  if (isSeatFree()) {
    if (tableType === ModelTableTypeEnum.Multi || tableType === ModelTableTypeEnum.SitAndGo) {
      return <div/>
    }
    if (currentUserPosition >= 0) {
      return <div/>
    }
    return (
      <div className={commonClasses.transformToCenter}>
        <IconButton
          className={commonClasses.reserveButton}
          color="inherit"
          onClick={() => handleReserve(position)}
        >
          <PersonAddIcon className={commonClasses.reserveIcon}/>
        </IconButton>
        <SignInDialog open={isRedirectDialogOpen} setOpen={setIsRedirectDialogOpen}/>
      </div>
    )
  }

  return (
    <div className={`${classes.root} ${isRight() ? classes.rightPlateShift : classes.leftPlateShift}`}>
      <Bet position={position} tableSize={tableSize} bet={playerOrEmpty().totalRoundBet} isRight={isRight()} height={getHeight()} width={getWidth()}/>
      <PlayerInfoPlate isRight={isRight()} position={position} player={playerOrEmpty()} height={getHeight()} className={sittingOutClass()}/>
      <AvatarPlate isRight={isRight()} player={playerOrEmpty()} height={getHeight()} width={getWidth()} className={sittingOutClass()}/>
      <ProfilePopover username={playerOrEmpty().username} userId={playerOrEmpty().userId} height={getHeight()}/>
      {
        playerOrEmpty().cards &&
          <HoleCards cards={playerOrEmpty().cards}
                     isFolded={isFolded()}
                     status={playerOrEmpty().status}
                     isRight={isRight()}
                     tableStatus={tableStatus}
                     position={seat.position}/>
      }
      <TimeoutBarPlate isRight={isRight()} isDeciding={playerOrEmpty().isDeciding} timeoutAt={playerOrEmpty().timeoutAt}/>
      {!isOffline && <HandNamePlate isRight={isRight()} holeCards={playerOrEmpty().cards} height={getHeight()}/>}
      <ChatMessagePlate playerUserId={playerOrEmpty().userId} position={position} isRight={isRight()}/>
      <EmojiPlate position={position} playerUserId={playerOrEmpty().userId} isRight={isRight()} height={getHeight()} width={getWidth()}/>
      <ItemPlate marketItemId={playerOrEmpty().marketItemId} isRight={isRight()} height={getHeight()} width={getWidth()}/>
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS, auth} = state
  return {
    tableId: tableWS.table.id,
    tableSize: tableWS.table.size,
    tableStatus: tableWS.table.status,
    isAuthenticated: auth.isAuthenticated,
    isEmailVerified: auth.isEmailVerified,
    currentUserPosition: tableWS.currentUserPosition,
    winnerPositions: tableWS.winnerPositions,
    isOffline: tableWS.isOffline
  };
};

export default connect(mapStateToProps)(UserPlate)