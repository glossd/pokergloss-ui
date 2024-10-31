import React, {useState} from "react";
import BigTextButton from "../UI/Button/BigTextButton/BigTextButton";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import {useTranslation} from "next-i18next";
import RoomInfo from "./RoomInfo";

const RoomInfoDialog = ({}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
  };

  return (
    <div>
      <div>
        <BigTextButton onClick={handleClickOpen}>
          {t("TournamentInfo")}
        </BigTextButton>

        {
          open &&
          <DefaultDialog
            open={open}
            onClose={handleClose}
            title={t("TournamentInfo")}
            cancel={{text: t("Ok"), onClick: handleClose}}
          >
            <RoomInfo/>
          </DefaultDialog>
        }
      </div>
    </div>
  )
}

export default RoomInfoDialog