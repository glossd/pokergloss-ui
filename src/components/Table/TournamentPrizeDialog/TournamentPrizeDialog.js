import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {subscribeBefore, unsubscribe} from "../../../redux/redux-subscribe-action";
import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";

import {useTranslation} from "next-i18next";
import {itemIcon} from "../../market/itemStore";

const TournamentPrizeDialog = ({currentUserPosition, tableType}) => {
  const router = useRouter()
  const {t} = useTranslation();

  const [info, setInfo] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    subscribeBefore("tournament-prize", (action) => {
      if (action.type === EventsTableEventTypeEnum.PlayerLeft) {
        const leftPlayer = action.payload.leftPlayer
        if (leftPlayer && leftPlayer.position === currentUserPosition) {
          if (leftPlayer.tournamentInfo) {
            setInfo(leftPlayer.tournamentInfo)
            setOpen(true)
          }

        }
      }
    })
    return () => {
      unsubscribe("tournament-prize")
    }
  }, [])

  const goLobby = () => {
    switch (tableType) {
      case "multi":
        router.push("/lobby/multi")
        break
      case "sitAndGo":
        router.push("/lobby/sitngo")
        break
    }
  }

  const close = () => {
    setOpen(false)
  }

  return (
    <DefaultDialog
      open={open}
      onClose={close}
      title={info.prize > 0 ? t("TournamentPrizeDialog.Congratulations") : t("TournamentPrizeDialog.GoodGame")}
      action={{text: t("TournamentPrizeDialog.GoToLobby"), onClick: goLobby}}
      cancel={{text: t("TournamentPrizeDialog.Stay"), onClick: close}}
    >
      <div className="tournament-prize-dialog-root">
        {
          info.prize > 0
            ? <div>
              <h3>{t("YouWon")}</h3>

              {info.marketPrize ?
                <div className='tournament-prize-dialog-market-prize'>
                  <span style={{width: '70px'}}>{itemIcon(info.marketPrize.itemId)}</span>
                  <span>{t("for")} {info.marketPrize.numberOfDays} {t("day")}</span>
                </div> :
                <div/>}

              <h1>
                <span>
                  <img className='Chips'
                       src='https://storage.googleapis.com/pokerblow/poker-table/bet-chips.png'
                       height={"40"}
                       width={"40"}
                       alt='chips'
                  />
                </span>
                {info.prize} {t("chips")}
              </h1>
              <h2>{t("TournamentPrizeDialog.YouAreOn")} {info.place} {t("place")}!</h2>
            </div>
            : <div>
              <h2>{t("TournamentPrizeDialog.YouAreOn")} {info.place} {t("place")}</h2>
              <h5>{t("DoNotWorry")}</h5>
            </div>
        }
      </div>
    </DefaultDialog>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    currentUserPosition: tableWS.currentUserPosition
  };
};

export default connect(mapStateToProps)(TournamentPrizeDialog)