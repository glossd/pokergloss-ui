import React from "react";
import BigTextButton from "../../UI/Button/BigTextButton/BigTextButton";
import {ModelPlayerStatusEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";
import {getCurrentUserPlayer} from "../util";
import {backToGame} from "../../../backend/table";

import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";
import {setCurrentPlayerStatus} from "../../../redux/actions/table";

const Back = ({tableId, currentPlayer, currentUserPosition, setCurrentPlayerStatus}) => {
  const {t} = useTranslation();

  function currentUserPlayerStatus() {
    if (currentPlayer) {
      return currentPlayer.status
    }
    return null
  }

  const backAction = () => {
    if (currentUserPosition >= 0) {
      backToGame(tableId, currentUserPosition)
        .catch((e) => {
          if (e.response) {
            if (e.response.status === 409 && e.response.data && e.response.data.message) {
              setCurrentPlayerStatus(e.response.data.message.status)
            }
          }
          backendError(e)
        });
    }
  }

  return (
    <div>
      {
        (currentUserPlayerStatus() === ModelPlayerStatusEnum.SittingOut) ?
          <div>
            <BigTextButton onClick={backAction}>
              {t("table.BackToGame")}
            </BigTextButton>
          </div>
          :
          <div/>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  const currentUserPosition = tableWS.currentUserPosition
  const currentPlayer = getCurrentUserPlayer(tableWS.table, currentUserPosition)
  return {tableId: tableWS.table.id, currentPlayer, currentUserPosition};
};

export default connect(mapStateToProps, {setCurrentPlayerStatus})(Back)