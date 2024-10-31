import React, {useEffect, useState} from "react";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "next-i18next";
import {connect} from "react-redux";
import Coin from "../UI/Coin";
import {backendError} from "../../backend/error";
import {selectQiwiOffer} from "../../backend/acquiring";
import {setCurrentPack} from "../../redux/actions/acquiring";
import DefaultCheckBox from "../UI/DefaultCheckBox/DefaultCheckBox";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "20px",
  },
  textContainer: {
    width: "85%"
  },
  coin: {
    width: "30%",
    height: "30%",
  },
  whiteDivider: {
    backgroundColor: "white",
    height: "1px",
    margin: "10px"
  }
}));

const OfferDialog = ({currentPack, setCurrentPack}) => {
  const classes = useStyles()
  const { t } = useTranslation();

  const [isConfirm, setIsConfirm] = useState(false)

  useEffect(() => {
    return () => {
      setIsConfirm(false)
    }
  }, [])

  function handleClose() {
    setCurrentPack(null)
  }

  function confirmPurchase() {

    selectQiwiOffer(currentPack.id)
      .then(data => {
        const win = window.open(data.redirectUrl, '_blank');
        win.focus();
        setCurrentPack(null)
      })
      .catch((e) => {
        backendError(e)
        setCurrentPack(null)
      })
  }

  function numberOfCoinsWithoutDiscount() {
    let price = currentPack.price * 100 / (100 * (100 - currentPack.specialDiscount))
    return price.toFixed(2)
  }

  if (!currentPack) {
    return <div/>
  }

  return (
    <DefaultDialog
      open={!!currentPack}
      onClose={handleClose}
      title={t("Coins.ConfirmPurchase")}
      action={{text: t("Coins.IConfirm"), disabled: !isConfirm, onClick: confirmPurchase}}
    >
      <div className={classes.root}>
        <div className={classes.coin}><Coin/></div>

        <div className={classes.textContainer}>
          <div>
            {t("Coins.AboutToBuy")} {currentPack.coins} {t("Coins.coins")}
          </div>

          {
            currentPack.specialDiscount > 0 &&
            <div>
              <div>
                {t("Coins.OldPrice")} {numberOfCoinsWithoutDiscount()} {t("Coins.rubles")}
              </div>
              <div>
                {t("Coins.Discount")} {currentPack.specialDiscount}%
              </div>
            </div>
          }

          <div>
            {t("Coins.ToPay")} {currentPack.priceView} {t("Coins.rubles")}
          </div>

          <div className={classes.whiteDivider}/>

          <DefaultCheckBox
            checked={isConfirm}
            onChange={(e) => setIsConfirm(e.target.checked)}
            label={t("Coins.ConfirmCheckBox")}
          />

          <div className={classes.whiteDivider}/>

          <Typography variant="body1">
            {t("Coins.redirectMessage")}
          </Typography>
        </div>
      </div>
    </DefaultDialog>
  )
}

const mapStateToProps = (state) => {
  const {acquiring} = state
  return {
    currentPack: acquiring.currentPack
  }
}

export default connect(mapStateToProps, {setCurrentPack})(OfferDialog)