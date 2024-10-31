import React, {useState} from "react";
import BigTextButton from "../../UI/Button/BigTextButton/BigTextButton";
import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import {ModelPlayerStatusEnum} from "@pokergloss/table-client-typescript";
import {connect} from "react-redux";
import {getCurrentUserPlayer} from "../util";
import {stand} from "../../../backend/table";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {errorMessage} from "../../../backend";
import {backendError} from "../../../backend/error";

const Stand = ({tableId, currentUserPosition, currentPlayerStatus}) => {
  const { t } = useTranslation();

  const isMobile = useMediaQuery('(max-device-width: 1224px)');

  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("")

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const leaveTable = () => {
    if (currentUserPosition >= 0) {
      stand(tableId, currentUserPosition)
        .then(() => {
          handleClose()
        })
        .catch(error => {
          setError(`Couldn't leave table: ${errorMessage(error)}`)
          console.error("Couldn't leave table: ", errorMessage(error))
          backendError(error)
        });
    }
  }

  const standWarning = () => {
    return (
      <div>
        {
          (!!currentPlayerStatus) ?
            <div>
              <BigTextButton onClick={handleClickOpen}>
                {t("table.Stand.Stand")}
              </BigTextButton>
            </div>
            :
            <div/>
        }
        <DefaultDialog
          open={open}
          onClose={handleClose}
          title={t("table.Stand.Stand")}
          action={{text:t("table.Stand.Stand"), onClick: leaveTable}}
          cancel={{text:t("table.Stand.Keep Playing"), onClick: handleClose}}
        >
          {
            (currentPlayerStatus === ModelPlayerStatusEnum.Playing) ?
              <div>
                If you stand now, your hand will be folded
              </div>
              :
              <div/>
          }
          {
            error &&
            <div style={{color: "red"}}>{error}</div>
          }
        </DefaultDialog>
      </div>
    )
  }

  return (
    <div className={`stand-common ${isMobile ? 'stand-mobile' : 'stand-desktop'}`}>
      {standWarning()}
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  const currentUserPosition = tableWS.currentUserPosition
  const currentPlayer = getCurrentUserPlayer(tableWS.table, currentUserPosition)
  const cpStatus = currentPlayer ? currentPlayer.status : ""
  return { tableId: tableWS.table.id, currentPlayerStatus: cpStatus, currentUserPosition};
};

export default  connect(mapStateToProps)(Stand)