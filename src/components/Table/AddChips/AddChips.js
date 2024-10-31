import React, {useState} from 'react';
import Slide from '@material-ui/core/Slide';
import {addChips} from "../../../backend/table";

import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import BigTextButton from "../../UI/Button/BigTextButton/BigTextButton";
import {getCurrentUserPlayer} from "../util";
import {connect} from "react-redux";
import DefaultSlider from "../../UI/DefaultSlider/DefaultSlider";
import {useTranslation} from "next-i18next";
import {errorMessage} from "../../../backend";
import {ButtonGroup} from "@material-ui/core";
import {backendError} from "../../../backend/error";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddChips = ({tableId, maxBuyIn, currentPlayerStack, currentUserPosition}) => {
  const { t } = useTranslation();

  const [chips, setChips] = useState(1)
  const [error, setError] = useState("")
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setChips(Math.ceil(playerMaxBuyIn/2))
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickAddChips = () => {
    addChips(tableId, currentUserPosition, chips)
      .then(() => {
        handleClose()
      })
      .catch(error => {
        setError(errorMessage(error))
        backendError(error)
      })
  }

  if (currentUserPosition < 0) {
    return <div/>
  }

  if (currentPlayerStack > maxBuyIn) {
    return <div/>;
  }

  const playerMaxBuyIn = maxBuyIn - currentPlayerStack;
  return (
    <div className='add-chips'>
      <div>
        <BigTextButton onClick={handleClickOpen}>
          {t("table.Popup.Add Chips")}
        </BigTextButton>
        {
          open &&
          <DefaultDialog
            open={open}
            onClose={handleClose}
            title={t("table.Popup.Add Chips")}
            action={{text: t("table.Popup.Ok"), onClick: handleClickAddChips}}
            cancel={{text: t("table.Popup.Cancel"), onClick: handleClose}}

            TransitionComponent={Transition}
            keepMounted
          >
            <div>
              {
                error &&
                <div style={{color: "red"}}>{error}</div>
              }
              <div style={{marginLeft: '15px', marginBottom: '15px'}}>
                {t("table.Popup.You can bring between")} {1} {t("table.Popup.and")} {currentUserPosition>0 && playerMaxBuyIn} {t("table.Popup.chips")}
              </div>
              <div className='add-chips-button-group-min-max'>
                <DefaultSlider
                  max={playerMaxBuyIn}
                  min={1}
                  value={chips}
                  setValue={setChips}
                />
                <ButtonGroup className='add-chips-button-group-min-max' disableElevation variant="contained">
                  <BigTextButton onClick={() => {
                    setChips(1)
                  }}>{t("table.Popup.min")}</BigTextButton>
                  <BigTextButton onClick={() => {
                    setChips(playerMaxBuyIn)
                  }}>{t("table.Popup.max")}</BigTextButton>
                </ButtonGroup>
              </div>

            </div>
          </DefaultDialog>
        }
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  const currentUserPosition = tableWS.currentUserPosition
  const table = tableWS.table;
  const currentPlayer = getCurrentUserPlayer(table, currentUserPosition)
  return { tableId: table.id, maxBuyIn: table.maxBuyIn, currentPlayerStack: currentPlayer ? currentPlayer.stack : 0, currentUserPosition};
};

export default connect(mapStateToProps)(AddChips);
