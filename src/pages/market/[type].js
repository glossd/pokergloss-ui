import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import {useTranslation} from "next-i18next";
import {listItems, listProducts} from "../../backend/market";
import BuyItemDialog from "../../components/market/BuyItemDialog";
import {getItem, itemExists} from "../../components/market/itemStore";
import {backendError} from "../../backend/error";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ItemCell, {itemCellTypes} from "../../components/market/ItemCell";
import {makeStyles} from "@material-ui/core/styles";
import Footer from "../../components/Footer/Footer";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import BuyProductDialog from "../../components/market/BuyProductDialog";
import {connect} from "react-redux";
import {getProduct, productExists} from "../../components/market/productStore";
import {clearMarket} from "../../redux/actions/market";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../../components/SEO";

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

const commonStyles = makeStyles(() => ({
  allItemsContainer: {
    padding: "5vw 0",
    display: "flex",
    justifyContent: "center",
  },
  tabs: {
    marginTop: "2vw",
    marginLeft: "5vw",
  }
}))

const MarketPage = ({currentItem, currentProduct, clearMarket}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const { type } = router.query
  const [items, setItems] = useState(null);
  const [products, setProducts] = useState(null);
  const isMobile = useMediaQuery('(max-device-width: 1224px)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  const classes = isPortrait ? portraitStyles() : (isMobile ? mobileStyles() : desktopStyles())
  const commonClasses = commonStyles()

  const [tabIndex, setTabIndex] = useState(typeToTabIdx(type))

  useEffect(() => {
    listItems()
      .then(data => {
        data.map(item => {
          return Object.assign(item, getItem(item.id))
        })
        setItems(data.filter(item => itemExists(item.id)))
      })
      .catch(backendError)

    listProducts()
      .then(data => {
        data.map(product => {
          return Object.assign(product, getProduct(product.id))
        })
        setProducts(data.filter(item => productExists(item.id)))
      })

    return () => {
      clearMarket()
    }
  }, [])

  function typeToTabIdx(type) {
    switch (type) {
      case "products":
        return 1
      case "items":
      default:
        return 0;
    }
  }

  function tabIdxToType(idx) {
    switch (idx) {
      case 1:
        return "products"
      case 0:
      default:
        return "items";
    }
  }

  const handleTabChange = (event, newValue) => {
    if (tabIndex !== newValue) {
      setTabIndex(newValue)
      clearMarket()
      router.push("/market/" + tabIdxToType(newValue))
    }
  }

  return (
    <div>
      <SEO title={"MarketPage.title"} description={"MarketPage.description"}/>
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Header.Market")},
        ]}
      />

      <Tabs
        className={commonClasses.tabs}
        value={tabIndex}
        onChange={handleTabChange}
      >
        <Tab label={t("MarketPage.TabItems")}/>
        <Tab label={t("MarketPage.TabOthers")}/>
      </Tabs>

      <div className={commonClasses.allItemsContainer}>
        <div className={classes.items}>
          {
            tabIndex === 0 && items && items.map((item) => {
              return (
                <ItemCell key={item.id} item={item} type={itemCellTypes.ITEM}/>
              )
            })
          }

          {
            tabIndex === 1 && products && products.map((product) => {
              return (
                <ItemCell key={product.id} item={product} type={itemCellTypes.PRODUCT}/>
              )
            })
          }
        </div>
      </div>

      {
        currentItem && <BuyItemDialog/>
      }
      {
        currentProduct && <BuyProductDialog/>
      }
      <Footer/>
    </div>
  )
}

const mapStateToProps = state => {
  const {market} = state
  return {
    currentItem: market.currentItem,
    currentProduct: market.currentProduct
  };
};

export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {clearMarket})(MarketPage)
