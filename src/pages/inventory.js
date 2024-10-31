import React, {useEffect, useState} from "react";
import Header from "../components/Header/Header";
import {useTranslation} from "next-i18next";
import {listMyItems} from "../backend/market";
import {backendError} from "../backend/error";

import {makeStyles} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import InventoryItemCell from "../components/Inventory/InventoryItemCell";
import {connect} from "react-redux";
import {setSelectedItemId} from "../redux/actions/inventory";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const desktopStyles = makeStyles(() => ({
  items: {
    display: 'grid',
    gridTemplateColumns: '16.8vw 16.8vw 16.8vw 16.8vw 16.8vw',
    gridAutoRows: '20.16vw',
    gridGap: '10px',
  }
}))

const mobileStyles = makeStyles(() => ({
  items: {
    display: 'grid',
    gridTemplateColumns: '28vw 28vw 28vw',
    gridAutoRows: '33.6vw',
    gridGap: '10px',
  }
}))

const portraitStyles = makeStyles(() => ({
  items: {
    display: 'grid',
    gridTemplateColumns: '43vw 43vw',
    gridAutoRows: '51.6vw',
    gridGap: '10px',
  }
}))

const Inventory = ({setSelectedItemId}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())

  const [myItems, setMyItems] = useState([])

  useEffect(() => {
    listMyItems()
      .then(items => {
        for (let item of items) {
          if (item.selected) {
            setSelectedItemId(item.itemId)
            break
          }
        }
        setMyItems(items)
      })
      .catch(backendError)
  }, [])

  const openMarket = () => {
    router.push("/market/items")
  }

  const openPurchases = () => {
    router.push("/inventory/purchases")
  }

  function myItemsEmptyMessage() {
    if (myItems && myItems.length === 0) {
      return (
        <div className='inventory-empty-message'>
          <span>{t("InventoryPage.EmptyMessage")},&nbsp;</span>
          <span className='inventory-message-link' onClick={openMarket}>{t("InventoryPage.EmptyMessageLink")}</span>.
        </div>
      )
    }
  }

  return (
    <div>
      <SEO title={"InventoryPage.title"} description={"InventoryPage.description"}/>
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Header.Inventory")},
        ]}
      />
      <div className='inventory-message-link inventory-purchase-link' onClick={openPurchases}>{t("InventoryPage.MyPurchasesLink")}</div>
      {myItemsEmptyMessage()}

      <div className="inventory-container">
        <div className={classes.items}>
          {myItems && myItems.map(item => {
            return (
              <InventoryItemCell key={item.itemId} item={item}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(null, {setSelectedItemId})(Inventory)