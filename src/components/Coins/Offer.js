import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Coin from "../UI/Coin";
import {useTranslation} from "next-i18next";
import BigTextButton from "../UI/Button/BigTextButton/BigTextButton";
import {connect} from "react-redux";
import {setCurrentPack} from "../../redux/actions/acquiring";

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    width: "250px",
    height: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    margin:"10px",
    color: "white",
    backgroundColor: "#0c1038",
  },
  coin: {
    marginTop: "15%",
    width: "40%"
  },
  numberOfCoins: {
    fontSize:"2em"
  },
  bottom: {
    width: "100%",
    backgroundColor: "#00739e",
    flexGrow: "1",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  price: {
    fontSize:"1.5em"
  },
  buy: {
    width: "30%"
  },
  sale: {
    color: '#ff0000',
    position: 'absolute',
    right: '3%',
    top: '3%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.3em',
    lineHeight: '1.25em',
  },
  saleNumber: {
    fontSize: '1.5em'
  }
}))

const Offer = ({pack, setCurrentPack}) => {
  const classes = useStyles()
  const {t} = useTranslation();

  if (!pack) {
    return <div/>
  }

  return (
    <div className={classes.root}>
      <div className={classes.coin}><Coin/></div>
      <div><span className={classes.numberOfCoins}>{pack.coins}</span> {t("Coins.coins")}</div>
      <div className={classes.bottom}>
        <span className={classes.price}>{pack.priceView} {t("Coins.rubles")}</span>&nbsp;
        <BigTextButton
          className={classes.buy}
          disabled={t("Coins.CoinsUnavailable")}
          onClick={() => setCurrentPack(pack)}
        >{t("Buy")}</BigTextButton>
      </div>

      {
        pack.specialDiscount > 0 &&
        <div className={classes.sale}>
          <div>SALE</div>
          <div className={classes.saleNumber}>{pack.specialDiscount}%</div>
        </div>
      }
    </div>
  )
}

export default connect (null, {setCurrentPack})(Offer)