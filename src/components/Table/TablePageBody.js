import React from "react";
import {connect} from "react-redux";
import {newTableEvent} from "../../redux/actions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Timer from "react-compound-timer";
import Stand from "./Stand/Stand";
import AddChips from "./AddChips/AddChips";
import PokerTableV2 from "./PokerTableV2/PokerTable";
import TournamentInfo from "./TournamentInfo/TournamentInfo";
import TournamentPrizeDialog from "./TournamentPrizeDialog/TournamentPrizeDialog";
import PlayerConfig from "./PlayerConfig";
import Chat from "./Chat/Chat";
import TablePokerActions from "./TablePokerActions/TablePokerActions";
import TableUserList from "./TableUserList/TableUserList";
import CardCombinations from "./CardCombinations/CardCombinations";
import BackToLobby from "./BackToLobby/BackToLobby";
import EmojiActions from "./TablePokerActions/EmojiActions";
import BigBlindSwitch from "./BigBlindSwitch";
import {useTranslation} from "next-i18next";
import PoorInternetConnection from "./PoorInternetConnection";
import { Offline } from "react-detect-offline";
import SurvivalLevel from "./PokerTableV2/SurvivalLevel";
import SpinningWheel from "./Survival/SpinningWheel";
import MasterMessage from "./Survival/MasterMessage";
import ActionsWithVoice from "./TablePokerActions/ActionsWithVoice";

const TablePageBody = ({tableId, tableType, tournamentAttrs, isEmailVerified, isAnonymous, currentUserPosition, status, isSurvival, isSurvivalWheelOpen, isOffline}) => {
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)');

  const isLoaded = () => {
    return !!tableType
  }

  const isAllowedToPlay = () => {
    return isLoaded() && (isEmailVerified || isAnonymous)
  }

  const isCashType = () => {
    if (!tableType) {
      return true // backward compatibility
    }
    return tableType === "cashGame"
  }

  const isTournament = () => {
    return !isCashType()
  }

  function statusMessage() {

    if (!status) return

    if (status === 404) {
      return t("table.DoesNotExist")
    } else {
      return t("table.SomethingWentWrong")
    }
  }

  return (
    <>
      <Offline>
        <div className={isMobile ? 'poor-internet-connection-mobile' : 'poor-internet-connection-desktop'}>
          <PoorInternetConnection/>
        </div>
      </Offline>

      <div className='status-err-message'>{statusMessage()}</div>
      <div className='tournament-duration'>
        {tournamentAttrs &&
        <Timer initialTime={Date.now() - tournamentAttrs.startAt}
               formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}>
          <Timer.Hours/> : <Timer.Minutes/> : <Timer.Seconds/>
        </Timer>}
      </div>

      {isMobile && ((isCashType() && currentUserPosition === -1) || isTournament() || isOffline) &&
      <div className='back-mobile-button'>
        <BackToLobby/>
      </div>
      }

      {isAllowedToPlay() && isCashType() && !isOffline && <Stand className={`stand-common ${isMobile ? 'stand-mobile' : 'stand-desktop'}`}/>}
      {isAllowedToPlay() && isCashType() && !isOffline && !isMobile && <AddChips/>}
      <div className={isMobile ? 'poker-table-mobile' : 'poker-table-desktop'}>
        <PokerTableV2 pageType={"table"}/>
      </div>

      <div className={`tournament-info-common ${isMobile ? 'tournament-info-mobile' : 'tournament-info-desktop'}`}>
        {isLoaded() && !!tournamentAttrs && <TournamentInfo/>}
      </div>
      {isTournament() && <TournamentPrizeDialog tableType={tableType}/>}

      <div className='chat-and-actbtn'>
        <div className={`player-config-common ${isMobile ? 'player-config-mobile' : 'player-config-desktop'}`}>
          {isAllowedToPlay() && !isOffline && <PlayerConfig/>}
        </div>
        {
          isAllowedToPlay() && !isMobile &&
          <div className='chat-v2'>
            <Chat/>
          </div>
        }
        <div className='actbtn-v2'>
          {isLoaded() && <TablePokerActions/>}
        </div>
        <div className='table-user-list'>
          {tableId && <TableUserList tableId={tableId}/>}
        </div>
        {!isMobile &&
          <div className='card-combinations-desktop'>
            <CardCombinations/>
          </div>
        }
        {!isOffline && <EmojiActions/>}
        {!isOffline && <ActionsWithVoice/>}
        <BigBlindSwitch/>

        {isSurvival && isSurvivalWheelOpen && <SpinningWheel/>}
      </div>

      {isAllowedToPlay() && isSurvival && <MasterMessage/>}

      {isAllowedToPlay() && isSurvival && <SurvivalLevel/>}
    </>
  )
}

const mapStateToProps = state => {
  const {tableWS, auth, news} = state
  let table = tableWS.table;
  const currentUserPosition = tableWS.currentUserPosition
  return {
    isOffline: tableWS.isOffline,
    tableId: table.id,
    tableType: table.type,
    isSurvival: table.isSurvival,
    tournamentAttrs: table.tournamentAttrs,
    isEmailVerified: auth.isEmailVerified,
    isAnonymous: auth.isAnonymous,
    currentUserPosition: currentUserPosition,
    status: tableWS.status,
    isSurvivalWheelOpen: news.isSurvivalWheelOpen
  };
};

export default connect(mapStateToProps, {newTableEvent})(TablePageBody);