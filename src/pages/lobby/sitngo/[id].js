import React, {useEffect} from "react";
import Header from "../../../components/Header/Header";
import PokerTable from "../../../components/Table/PokerTableV2/PokerTable";
import {connect} from "react-redux";
import {unregisterSitngo} from "../../../backend/table";
import {useTranslation} from "next-i18next";

import {newEvent} from "../../../redux/actions";
import {clearTable, setCurrentUserPosition} from "../../../redux/actions/table";
import BigTextButton from "../../../components/UI/Button/BigTextButton/BigTextButton";
import {getCurrentUser} from "../../../auth/Firebase";
import {subscribeBefore} from "../../../redux/redux-subscribe-action";
import EntityWS from "../../../backend/table-stream/entity-ws";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {backendError} from "../../../backend/error";
import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import RoomInfo from "../../../components/SitngoRoom/RoomInfo";
import RoomPrizes from "../../../components/SitngoRoom/RoomPrizes";
import RoomInfoDialog from "../../../components/SitngoRoom/RoomInfoDialog";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../../../components/SEO";

const desktopStyles = makeStyles(() => ({
  pokerTable: {
    width: '100%',
    height: '73.5%',
  },
  roomInfo: {
    position: 'absolute',
    top: '80px',
    right: '1%',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: 'white',
    padding: '5px',
    fontSize: '17px',
  },
  roomPrizes: {
    position: 'absolute',
    top: '270px',
    right: '1%',
  }
}))

const mobileStyles = makeStyles(() => ({
  pokerTable: {
    width: '85%',
    height: '100%',
  },
  roomInfo: {
    position: 'absolute',
    top: '80px',
    right: '1%',
  },
  roomPrizes: {
    position: 'absolute',
    top: '125px',
    right: '1%',
  }
}))

const Id = ({table, isEmailVerified, currentUserPosition, newEvent, clearTable, setCurrentUserPosition}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query
  const isMobile = useMediaQuery('(max-device-width: 1224px)');
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isMobile ? mobileStyles() : desktopStyles()

  subscribeBefore("sitngo-page", (action) => {
    if (action.type === "sitngoRegister") {
      let adaptedSeat = action.payload;
      getCurrentUser().then(user => {
        if (user) {
          if (adaptedSeat.player.userId === user.uid) {
            setCurrentUserPosition(adaptedSeat.position)
          }
        }
      })
      let adaptedEvent = {type: EventsTableEventTypeEnum.SeatReserved, payload: { table: {seats: [adaptedSeat]}}}
      newEvent(adaptedEvent)
    }
    if (action.type === "sitngoUnregister") {
      const position = action.payload.position
      let adaptedEvent = {type: EventsTableEventTypeEnum.PlayerLeft, payload: { table: {seats: [{position: position, player: null}]}}}
      if (position === currentUserPosition) {
        setCurrentUserPosition(-1)
      }
      newEvent(adaptedEvent)
    }
  })

  useEffect(() => {
    newEvent({type: "id", payload: {table: {id}}})
    return () => {
      clearTable()
    }
  }, [])

  const isLoaded = () => {
    return !!table.seats
  }

  const isAllowedToPlay = () => {
    return isLoaded() && isEmailVerified
  }

  const onUnregister = () => {
    unregisterSitngo(id, currentUserPosition)
      .catch(backendError)
  }

  if (isMobile && isPortrait) {
    return <div className="screen-too-narrow">
      <img
        src="https://storage.googleapis.com/pokerblow/rotate-phone.png"
        className="invert-color"
        width='100px'
        height='100px'
        alt="rotate phone"/>
    </div>
  }

  return (
    <div className="sitngo-registry-page">
      <EntityWS id={id} type={"sitngoLobby"}/>
      <SEO title={"RoomInfo.sitngo.title"} description={"RoomInfo.sitngo.description"}/>
      <div className='poker-table-header'>
        <Header
          links={[
            {name: t("Header.Lobby"), to: '/lobby/sitngo'},
            {name: (table.name)},
          ]}/>
      </div>
      {isAllowedToPlay() && currentUserPosition >= 0 && <BigTextButton className="sitngo-registry-unregister" onClick={onUnregister}>{t("Unregister")}</BigTextButton>}
      <div className={classes.pokerTable}>
        <PokerTable pageType={"sitngo"}/>
      </div>

      <div className={classes.roomInfo}>
        {
          isMobile ?
            <RoomInfoDialog/> :
            <RoomInfo/>
        }
      </div>

      <div className={classes.roomPrizes}>
        <RoomPrizes/>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS, auth } = state
  return { table: tableWS.table,
    currentUserPosition: tableWS.currentUserPosition,
    isEmailVerified: auth.isEmailVerified, isAuthenticated: auth.isAuthenticated,
  };
};

export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, { newEvent, clearTable, setCurrentUserPosition })(Id)