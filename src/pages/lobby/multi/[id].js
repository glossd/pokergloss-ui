import React, {useEffect, useState} from "react";

import Header from "../../../components/Header/Header";
import {useTranslation} from "next-i18next";
import {registerMulti, unregisterMulti} from "../../../backend/table";
import TournamentStartTime from "../../../components/UI/TournamentStartTime/TournamentStartTime";
import {connect} from "react-redux";
import {newEvent} from "../../../redux/actions";
import EntityWS from "../../../backend/table-stream/entity-ws";
import MultiTablesPreview from "../../../components/MultiRoom/MultiTablesPreview/MultiTablesPreview";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {clearMultiRoom} from "../../../redux/actions/multiRoom";
import {getCurrentUser} from "../../../auth/Firebase";
import DefaultButton from "../../../components/UI/Button/DefaultButton/DefaultButton";
import Footer from "../../../components/Footer/Footer";
import YouTube from "react-youtube";
import * as ReactGA from "react-ga";
import {backendError} from "../../../backend/error";
import {itemIcon} from "../../../components/market/itemStore";
import RoomPlayers from "../../../components/MultiRoom/RoomPlayers/RoomPlayers";
import SurvivalTicket from "../../../components/Lobby/Survival/SurvivalTicket";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../../../components/SEO";

const AnalyticsCategory = "Video Tournament"

const Id = ({room, isRegistered, isAuthenticated, isAnonymous, isEmailVerified, clearMultiRoom, multiRoomStatus}) => {
  const router = useRouter();
  const { id } = router.query
  const {t} = useTranslation();

  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const [isMyTable, setIsMyTable] = useState(false)

  useEffect(() => {
    return () => {
      clearMultiRoom()
    }
  }, [])

  useEffect(() => {
    if (room.tables) {
      checkIsMyTableExists()
    }
  }, [room.tables])

  const register = () => {
    if (room && room.lastVideoID) {
      ReactGA.event({
        category: AnalyticsCategory,
        action: "Register",
      });
    }

    if (isAnonymous) {
      router.push("/signup");
      return;
    }

    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    if (!isEmailVerified) {
      router.push("/verify-email")
      return
    }

    registerMulti(id)
      .catch(backendError)
  }

  const unregister = () => {
    unregisterMulti(id)
      .catch(backendError)
  }

  const onVideoClick = () => {
    ReactGA.event({
      category: AnalyticsCategory,
      action: "Play Video",
    });
  }

  function adaptMultiRoomName(name) {
    if (!name) {
      return name
    }
    if (name === "Daily Tournament") {
      return t("Daily Tournament")
    }
    if (name.startsWith("Freeroll")) {
      return t("Freeroll") + name.substring("Freeroll".length)
    }
    return name
  }

  function firstMultiInfo() {
    return (
      <div>
        <div>{t("RoomInfo.Starts")} {<TournamentStartTime startAt={room.startAt}
                                                                          autoUpdate={true}/>}</div>
        <div>{t("RoomInfo.Game")} {`${room.bettingLimit} Hold'em`}</div>
        <div>{t("RoomInfo.BuyIn")} Freeroll</div>
        <div>{t("RoomInfo.SeatsPerTable")} {room.tableSize}</div>
        <div>{t("RoomInfo.StartingStack")} {room.startingChips}</div>
        <div>{t("RoomInfo.StartingBlinds")} {room.startingBigBlind / 2 + '/' + room.startingBigBlind}</div>
        <div>{t("RoomInfo.BlindsUpTime")} {room.levelIncreaseTimeMin} {t("min")}</div>
        {room.tables && room.tables.length > 0 && <div>{t("RoomInfo.Decision")} {room.tables[0].decisionTimeoutSec} {t("sec")}</div>}
      </div>
    )
  }

  function secondMultiInfo() {
    return (
      <div>
        <div>{t("RoomInfo.Status")} {room.status}</div>
        <div>{t("RoomInfo.MinimumPlayers")} 2</div>
        <div>{t("RoomInfo.RegisteredPlayers")} {room.players && room.players.length}</div>
        <hr className='multi-table-white-line'/>

        <div className="multi-table-market-prize-default">
          <div>{t("RoomInfo.SurvivalNote")}</div>
          <div className='multi-table-icon'><SurvivalTicket/></div>
        </div>

        {room.marketPrize &&
        <div className={room.marketPrize.itemId === "crown" ? "multi-table-market-prize-crown" : "multi-table-market-prize-default"}>
          <span>{t("RoomInfo.TheWinnerWillReceive")}</span>
          <span className='multi-table-icon'>{itemIcon(room.marketPrize.itemId)}</span>
          <span>{t("for")} {room.marketPrize.numberOfDays} {t("day")}</span>
        </div>}

        <div>{t("RoomInfo.PrizePool")} {room.players && room.prizePerUser * room.players.length} {t("chips")}</div>
        <div>{t("RoomInfo.PlacesPaid")} {room.prizes && room.prizes.length}</div>
        <div>{t("RoomInfo.PrizeDistribution")}</div>
        <div className='multi-table-places-distribution'>
          {
            room.prizes && room.prizes.map((gambler) => {
              return <div
                key={gambler.place}>{`${gambler.place}. ${gambler.prize} ${t("chips")}`}</div>
            })
          }
        </div>
        {
          room.lastVideoID &&
          <div className='multi-room-video-container'>
            <div>{t("RoomInfo.LastTournamentVideo")}</div>
            <YouTube className='multi-room-video'
                     videoId={room.lastVideoID}
                     opts={{playerVars:{autoplay:0}}}
                     onPlay={() => onVideoClick()}/>
          </div>
        }
      </div>
    )
  }

  function statusMessage() {
    let message = `${t("MultiPage.Status.TournamentStatus")} `

    if (multiRoomStatus === 404 || !room.status) {
      if (room.id === '5fea7180df0ccde21ef5e2c0' || room.id === '60280c0072d38a27d9264d88') {
        message += `${t("MultiPage.Status.later")}`
      } else {
        message += `${t("MultiPage.Status.undefined")}`
      }
    } else {
      message += `${room.status}`
    }
    return message
  }

  function checkIsMyTableExists() {

    getCurrentUser().then(user => {
      let allPlayerIds = room.tables
        .flatMap(table => table.seats)
        .map(seat => seat.player)
        .filter(player => player)
        .map(player => player.userId)

      if (allPlayerIds.includes(user.uid)) {
        setIsMyTable(true)
      } else {
        setIsMyTable(false)
      }
    })
  }

  const handleOpenMyTable = () => {
    getCurrentUser().then(user => {
      for (let table of room.tables) {
        table.seats.map((seat) => {
          if (seat.player) {
            if (seat.player.userId === user.uid) {
              router.push(`/tables/${table.id}`)
            }
          }
        })
      }
    })
  }

  function availableButton(status) {

    if (status === 'registering') {
      if (isRegistered) {
        return <DefaultButton onClick={unregister}>{t("MultiPage.Status.UnregisterAction")}</DefaultButton>
      } else {
        return <DefaultButton onClick={register}>{t("MultiPage.Status.RegisterAction")}</DefaultButton>
      }
    } else {
      if (isMyTable) {
        return <DefaultButton onClick={handleOpenMyTable}>{t("MultiPage.TablesPreview.OpenMyTable")}</DefaultButton>
      } else {
        return <div>{statusMessage()}</div>
      }
    }
  }

  return (
    <div>
      <div style={{flex: '1 0 auto'}}
           className={`${isMobile ? 'multi-table-font-size-mobile' : 'multi-table-font-size-desktop'}`}>
        <EntityWS id={id} type={"multiLobby"}/>
        <SEO title={"RoomInfo.multi.title"} description={"RoomInfo.multi.description"}/>
        <Header
          links={[
            {name: t("Header.Lobby"), to: '/lobby/multi'},
            {name: adaptMultiRoomName(room.name)},
          ]}/>

        <div className='multi-table-available-button'>
          {room.status && room.tables && <div>{availableButton(room.status)}</div>}
        </div>

        <div className='multi-table'>
          <div className='multi-table-info-root'>
            <div className='multi-table-info'>
              {multiRoomStatus === 200 && room.status && firstMultiInfo()}
              {isMobile && multiRoomStatus === 200 && room.status && secondMultiInfo()}
            </div>
            {
              !isMobile && multiRoomStatus === 200 && room.status &&
              <div className='multi-table-info'>
                {secondMultiInfo()}
              </div>
            }
          </div>
          <div className='multi-table-room-vertical-line'/>

          <RoomPlayers id={id}/>
        </div>
        <MultiTablesPreview tables={room.tables}/>
      </div>
      <Footer/>
    </div>
  )
}

const mapStateToProps = state => {
  const {multiRoom, auth} = state
  return {
    room: multiRoom.room, isRegistered: multiRoom.isRegistered, multiRoomStatus: multiRoom.status,
    isAuthenticated: auth.isAuthenticated, isEmailVerified: auth.isEmailVerified, isAnonymous: auth.isAnonymous,
  }
}

export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {newEvent, clearMultiRoom})(Id)