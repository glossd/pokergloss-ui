import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Header from "../components/Header/Header";
import Offer from "../components/Coins/Offer";
import {useTranslation} from "next-i18next";
import Footer from "../components/Footer/Footer";
import {backendError} from "../backend/error";
import {listQiwiOffers} from "../backend/acquiring";
import OfferDialog from "../components/Coins/OfferDialog";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const useStyles = makeStyles(() => ({
  root: {
  },
  bodyRoot: {
    minHeight: "85vh"
  },
  message: {
    color: "#cddc00",
    fontSize: "2em",
    marginLeft: "60px",
    marginTop: "30px",
  },
  priceList: {
    display:"flex",
    flexWrap: "wrap",
    padding: "20px",
    marginLeft: "50px"
  }
}))

const Coins = () => {
  const classes = useStyles()
  const {t} = useTranslation();

  const [priceList, setPriceList] = useState([])
  const [isQiwi, setQiwi] = useState(false)

  useEffect(() => {
    let isRussian = navigator.language.startsWith("ru")
    if (isRussian) {
      setQiwi(true)
    } else {
      fetch("https://ip2c.org/self")
        .then(r => r.text())
        .then(text => {
          if (text.substring(text.indexOf(";")+1).startsWith("RU")) {
            setQiwi(true)
          }
        })
        .catch(e => console.error(e))
    }
  }, [])

  useEffect(() => {
    if (isQiwi) {
      listQiwiOffers()
        .then(data => {
          setPriceList(data)
        })
        .catch(backendError)
    }
  }, [isQiwi])

  return (
    <div className={classes.root}>
      <SEO title={"Coins.title"} description={"Coins.description"}/>
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Coins.BuyCoins")},
        ]}
      />
      <div className={classes.bodyRoot}>
        {
          isQiwi ?
            <div>
              <div className={classes.priceList}>
                {priceList.map(pack => <Offer key={pack.id} pack={pack}/>)}
              </div>
              <OfferDialog/>
            </div> :
            <div className={classes.message}>{t("Coins.CoinsUnavailable")}</div>
        }
      </div>
      <Footer/>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default Coins