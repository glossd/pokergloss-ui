import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {setCurrentProduct} from "../../redux/actions/market";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import {useTranslation} from "next-i18next";
import {buyProduct} from "../../backend/market";
import {backendError} from "../../backend/error";
import {makeStyles} from "@material-ui/core/styles";
import {productIcon} from "./productStore";
import {useRouter} from "next/router";

const styles = makeStyles(() => ({
  productIcon: {
    maxWidth: 300,
    margin: "-60px auto",
    display: "flex",
    justifyContent: "center"
  }
}))

const BuyProductDialog = ({currentProduct, setCurrentProduct}) => {
  const {t} = useTranslation();
  const classes = styles()
  const router = useRouter()
  const [isBought, setIsBought] = useState(false);
  const [error, setError] = useState("")

  const isSurvivalTickets = currentProduct && currentProduct.id === "5tickets"

  useEffect(() => {
    return () => {
      setError("")
    }
  }, [currentProduct])

  const handleClose = () => {
    setCurrentProduct(null)
    setIsBought(false)
  };

  const handleBuy = () => {
    buyProduct(currentProduct.id)
      .then(() => {
        setIsBought(true)
        setError("")
      })
      .catch(e => {
        if (e.response && e.response.status && e.response.status === 412) {
          setError(t("InsufficientFunds"))
        } else {
          const msg = backendError(e);
          setError(msg)
        }
      })
  }

  const openSurvival = () => {
    handleClose()
    router.push("/lobby/survival")
  }

  return (
    <DefaultDialog
      open={!!currentProduct}
      onClose={handleClose}
      title={t(`${currentProduct.name}`)}
      action={isBought ? {text: t("MarketPage.goToSurvival"), onClick: openSurvival} : {text: t("MarketPage.buy"), onClick: handleBuy}}
      cancel={{text: t("MarketPage.close"), onClick: handleClose}}
    >

      <div>
        <div className={classes.productIcon}>
          {productIcon(currentProduct.id)}
        </div>

        <div className='market-dialog-container'>
          {
            isBought ?
              <div className='market-dialog-bought-message'>
                {t("MarketPage.BoughtMessage")}
              </div> :
              <div>
                <hr className='market-horizon-line'/>
                <div className='market-total-price'>
                  {`${t("MarketPage.TotalPrice")}: ${currentProduct.Price} ${t(currentProduct.saleType)}`}
                </div>

                {
                  isSurvivalTickets &&
                  <a href="https://info.pokerblow.com/articles/survival" target="_blank">
                    <HelpOutlineIcon/> {t("lobby.Survival")}
                  </a>
                }

                {error && <div className={"market-dialog-error"}>{error}</div>}
              </div>
          }
        </div>
      </div>
    </DefaultDialog>
  )
}

const mapStateToProps = state => {
  const {market} = state
  return {
    currentProduct: market.currentProduct
  };
};

export default connect(mapStateToProps, {setCurrentProduct})(BuyProductDialog)