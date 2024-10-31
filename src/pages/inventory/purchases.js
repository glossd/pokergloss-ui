import React, {useEffect, useState} from 'react'
import Header from "../../components/Header/Header";
import moment from "moment";
import {useTranslation} from "next-i18next";
import {backendError} from "../../backend/error";
import DefaultTableCell from "../../components/UI/DefaultTable/DefaultTableCell";
import DefaultTableRow from "../../components/UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../../components/UI/DefaultTable/DefaultTable";
import {listMyPurchases} from "../../backend/market";
import {makeStyles} from "@material-ui/core/styles";
import {getItem} from "../../components/market/itemStore";
import SEO from "../../components/SEO";

import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const useStyles = makeStyles(() => ({
  historyTableContainer: {
    display: 'flex',
    backgroundColor: '#070f14',
  },
  historyTable: {
    margin: '5vw',
    backgroundColor: '#070f14',
  },
}));

function Purchases() {
  const {t} = useTranslation();
  const classes = useStyles();
  const router = useRouter();
  const [purchaseListLine, setPurchaseListLine] = useState([])

  useEffect(() => {
    listMyPurchases()
      .then(data => setPurchaseListLine(data))
      .catch(backendError)
  }, [])

  const tableHeaders = () => {
    return [t("PurchaseListPage.Date"), t("PurchaseListPage.Unit"), t("PurchaseListPage.TimeFrame"),
      t("PurchaseListPage.Number"), t("PurchaseListPage.Price"), t("PurchaseListPage.TotalPrice")]
  }

  const roomRow = (operation) => {
    return [moment(operation.createdAt).format('DD MMM, hh:mm A'), t(getItem(operation.itemId).name),
      operation.timeFrame, operation.units, operation.unitPrice, operation.units * operation.unitPrice]
  }

  const openMarket = () => {
    router.push("/market/items")
  }

  return (
    <div>
      <SEO title={"PurchaseListPage.title"} description={"PurchaseListPage.description"}/>
      <Header
        links={[
          {name: t("Header.Inventory"), to: '/inventory'},
          {name: t("Header.PurchaseList")},
        ]}
      />

      {
        (purchaseListLine && purchaseListLine.length === 0) ?
          <div className='purchase-empty-message'>
            <span>{t("PurchaseListPage.EmptyMessage")},&nbsp;</span>
            <span className='purchase-empty-message-link'
                  onClick={openMarket}>{t("PurchaseListPage.EmptyMessageLink")}</span>.
          </div> :
          <div>
            <DefaultTable
              containerClassName={classes.historyTableContainer}
              tableClassName={classes.historyTable}
              headers={tableHeaders()}
              body={
                purchaseListLine.map(line => {
                  return (
                    <DefaultTableRow key={line.id}>
                      {roomRow(line).map((v, idx) => (
                        <DefaultTableCell key={idx}>{v}</DefaultTableCell>))}
                    </DefaultTableRow>)
                })
              }
            />
          </div>
      }
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default Purchases