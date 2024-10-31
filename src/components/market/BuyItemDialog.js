import React, {useEffect, useState} from "react";
import BigTextButton from "../UI/Button/BigTextButton/BigTextButton";
import DefaultDialog from "../UI/DefaultDialog/DefaultDialog";
import {ButtonGroup} from "@material-ui/core";
import {useTranslation} from "next-i18next";
import {buyItem} from "../../backend/market";
import {ModelBuyItemParamsTimeFrameEnum} from "@pokergloss/market-client-typescript";
import {backendError} from "../../backend/error";
import {connect} from "react-redux";
import {setCurrentItem} from "../../redux/actions/market";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ItemPreview from "./ItemWithUserPlate";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import {useRouter} from "next/router";

const BuyItemDialog = ({currentItem, setCurrentItem}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitTimeFrame, setUnitTimeFrame] = useState(1);
  const [units, setUnits] = useState(1);
  const [isBought, setIsBought] = useState(false);
  const [error, setError] = useState("")

  const isVip = currentItem && currentItem.saleType === "coins"

  useEffect(() => {
    if (currentItem) {
      setUnitPrice(currentItem.priceList.day)
    }
    return () => {
      setError("")
    }
  }, [currentItem])

  const handleClose = () => {
    setUnitPrice(currentItem.priceList.day)
    setUnitTimeFrame(1)
    setUnits(1)
    setCurrentItem(null)
    setIsBought(false)
  };

  const handleBuy = () => {
    let timeFrame
    switch (unitTimeFrame) {
      case 1:
        timeFrame = ModelBuyItemParamsTimeFrameEnum.Day
        break
      case 7:
        timeFrame = ModelBuyItemParamsTimeFrameEnum.Week
        break
      case 30:
        timeFrame = ModelBuyItemParamsTimeFrameEnum.Month
        break
    }

    buyItem(currentItem.id, timeFrame, units)
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
  };

  function discount() {
    let discount = 100 - ((unitPrice * 100) / (currentItem.priceList.day * unitTimeFrame))
    if (discount === 0 || unitPrice === null) {
      return '-'
    } else {
      return `${Math.round(discount)}%`
    }
  }

  function daysButton(itemCost, btnTimeFrame) {
    function title() {
      switch (btnTimeFrame) {
        case 1:
          return `${btnTimeFrame} ${t("MarketPage.day")}`
        case 7:
        case 30:
          return `${btnTimeFrame} ${t("MarketPage.days")}`
      }
    }

    return (
      <BigTextButton
        className={`market-item-button ${(unitTimeFrame === btnTimeFrame) ? 'market-item-days-button-selected' : 'market-item-days-button-unselected'}`}
        onClick={() => {
          setUnitPrice(itemCost)
          setUnitTimeFrame(btnTimeFrame)
        }}
      >{title()}</BigTextButton>
    )
  }

  const openInventory = () => {
    handleClose()
    router.push("/inventory")
  }

  if (!currentItem) {
    return <div/>
  }

  return (
    <div>
      <DefaultDialog
        open={!!currentItem}
        onClose={handleClose}
        title={t(`${currentItem.name}`)}
        action={isBought ? {text: t("MarketPage.goToInventory"), onClick: openInventory} : {text: t("MarketPage.buy"), onClick: handleBuy}}
        cancel={{text: t("MarketPage.close"), onClick: handleClose}}
      >
        <div>
          <div className='market-dialog-container'>
            {isPortrait && <ItemPreview marketItemId={currentItem.id}/>}
          </div>

          <div className='market-dialog-container'>
            {!isPortrait && <ItemPreview marketItemId={currentItem.id}/>}
            {
              isBought ?
                <div className='market-dialog-bought-message'>
                  {t("MarketPage.BoughtMessage")}
                </div> :
                <div>
                  <div>
                    <ButtonGroup disableElevation variant="contained">
                      {daysButton(currentItem.priceList.day, 1)}
                      {daysButton(currentItem.priceList.week, 7)}
                      {daysButton(currentItem.priceList.month, 30)}
                    </ButtonGroup>
                  </div>

                  <div className='market-items-number-buttons'>
                    <ButtonGroup disableElevation variant="contained">
                      <BigTextButton
                        className='market-item-button'
                        onClick={() => {
                          setUnits(units - 1)
                        }}
                        disabled={units <= 1}
                      >-</BigTextButton>
                      <BigTextButton
                        className='market-items-number'
                        disabled={true}
                      >{units}</BigTextButton>
                      <BigTextButton
                        className='market-item-button'
                        onClick={() => {
                          setUnits(units + 1)
                        }}
                      >+</BigTextButton>
                    </ButtonGroup>
                  </div>
                  <hr className='market-horizon-line'/>
                  {unitPrice &&
                  <>
                    <div className='market-total-price'>
                      {`${t("MarketPage.Discount")}: ${discount()}`}
                    </div>
                    <div className='market-total-price'>
                      {`${t("MarketPage.TotalPrice")}: ${unitPrice * units} ${t(currentItem.saleType)}`}
                    </div>
                  </>}
                  {isVip && <a href="https://info.pokerblow.com/articles/vip" target="_blank"><HelpOutlineIcon/> {t("MarketPage.vipAdvantages")}</a>}
                  {error && <div className={"market-dialog-error"}>{error}</div>}
                </div>
            }
          </div>
        </div>
      </DefaultDialog>
    </div>
  )
}

const mapStateToProps = state => {
  const {market} = state
  return {
    currentItem: market.currentItem
  };
};

export default connect(mapStateToProps, {setCurrentItem})(BuyItemDialog)