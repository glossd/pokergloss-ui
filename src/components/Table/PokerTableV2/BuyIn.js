import React, {useState} from 'react';
import Slide from '@material-ui/core/Slide';
import {buyIn, cancelReservation} from "../../../backend/table";

import DefaultDialog from "../../UI/DefaultDialog/DefaultDialog";
import {connect} from "react-redux";
import {setOpenBuyIn} from "../../../redux/actions/table";
import DefaultSlider from "../../UI/DefaultSlider/DefaultSlider";
import {errorMessage} from "../../../backend";
import {ButtonGroup} from "@material-ui/core";
import BigTextButton from "../../UI/Button/BigTextButton/BigTextButton";
import {useTranslation} from "next-i18next";
import {backendError} from "../../../backend/error";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BuyIn = ({tableId, maxBuyIn, minBuyIn, currentUserPosition, openBuyIn, setOpenBuyIn}) => {
  const { t } = useTranslation();
  const [chips, setChips] = useState((maxBuyIn+minBuyIn)/2)
  const [error, setError] = useState("")

  const handleClickOk = () => {
    buyIn(tableId, currentUserPosition, chips)
      .then(() => {
        setOpenBuyIn(false)
      })
      .catch(error => {
        backendError(error)
        setError(errorMessage(error))
        setOpenBuyIn(false)
      })
  }

  const handleClickCancelReservation = () => {
    cancelReservation(tableId, currentUserPosition)
      .then(() => {
        setOpenBuyIn(false)
      })
      .catch(error => {
        setError(errorMessage(error))
        setOpenBuyIn(false)
        backendError(error)
      })
  }

  if (!minBuyIn) {
    return <div/>
  }

  return (
    <div>
      <DefaultDialog
        open={openBuyIn}
        onClose={handleClickCancelReservation}
        title={t("table.Popup.BuyIn")}
        action={{text: t("table.Popup.Ok"), onClick: handleClickOk}}
        cancel={{text: t("table.Popup.Cancel"), onClick: handleClickCancelReservation}}

        TransitionComponent={Transition}
        keepMounted
      >
      <div>
        {
          error &&
          <div style={{color: "red"}}>{error}</div>
        }
        <div style={{marginLeft: '15px', marginBottom: '15px'}}>
          {t("table.Popup.You can bring between")} {minBuyIn} {t("table.Popup.and")} {maxBuyIn} {t("table.Popup.chips")}
        </div>
        <div className='buyin-slider-min-max'>
          <DefaultSlider
            max={maxBuyIn}
            min={minBuyIn}
            value={chips}
            setValue={setChips}
          />
          <ButtonGroup className='buyin-button-group-min-max' disableElevation variant="contained">
            <BigTextButton onClick={() => {setChips(minBuyIn)}}>{t("table.Popup.min")}</BigTextButton>
            <BigTextButton onClick={() => {setChips(maxBuyIn)}}>{t("table.Popup.max")}</BigTextButton>
          </ButtonGroup>
        </div>
      </div>

      </DefaultDialog>
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS } = state
  let table = tableWS.table;
  return {
    tableId: table.id,
    currentUserPosition: tableWS.currentUserPosition,
    maxBuyIn: table.maxBuyIn,
    minBuyIn: table.minBuyIn,
    openBuyIn: tableWS.openBuyIn};
};


export default connect(mapStateToProps, {setOpenBuyIn})(BuyIn)
