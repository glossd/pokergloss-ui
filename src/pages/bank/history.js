import React, {useEffect, useState} from 'react'
import Header from "../../components/Header/Header";
import {getOperations} from "../../backend/bank";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {ModelOperationTypeEnum} from "@pokergloss/bank-client-typescript/dist/api";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {useTranslation} from "next-i18next";
import {backendError} from "../../backend/error";
import DefaultTableCell from "../../components/UI/DefaultTable/DefaultTableCell";
import DefaultTableRow from "../../components/UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../../components/UI/DefaultTable/DefaultTable";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../../components/SEO";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  historyTableContainer: {
    display: 'flex',
    backgroundColor: '#070f14',
  },
  historyTable: {
    margin: '5vw',
    backgroundColor: '#070f14',
  },
  depositIcon: {
    color: '#6bff08'
  },
  withdrawIcon: {
    color: '#f71d1d'
  }
}));

function History() {
  const {t} = useTranslation();
  const classes = useStyles();
  const [chipHistoryLine, setChipHistoryLine] = useState([])
  const limit = 20

  useEffect(() => {
    getOperations(0, limit)
      .then(data => setChipHistoryLine(data))
      .catch(backendError)
  }, [])

  function getMoreOperations() {
    getOperations(chipHistoryLine.length, limit)
      .then(data => {
        setChipHistoryLine(chipHistoryLine.concat(data))
      })
      .catch(backendError)
  }

  function operationChange(chips, type) {

    function operationType() {
      if (type === ModelOperationTypeEnum.Deposit) {
        return <ArrowUpwardIcon className={classes.depositIcon}/>
      }
      if (type === ModelOperationTypeEnum.Withdraw) {
        return <ArrowDownwardIcon className={classes.withdrawIcon}/>
      }
    }

    return (
      <div>
        {chips} {operationType(type)}
      </div>
    )
  }

  const tableHeaders = () => {
    return [t("ChipHistoryPage.Date"), t("ChipHistoryPage.Change"), t("ChipHistoryPage.Type"), t("ChipHistoryPage.Description")]
  }

  const roomRow = (operation) => {
    return [moment(operation.createdAt).format('DD MMM, hh:mm A'), operationChange(operation.chips, operation.type),
      operation.reason, operation.description]
  }

  return (
    <div>
      <SEO title={"ChipHistoryPage.title"} description={"ChipHistoryPage.description"} />
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Header.ChipHistory")},
        ]}
      />

      <InfiniteScroll
        dataLength={chipHistoryLine.length}
        next={getMoreOperations}
        hasMore={chipHistoryLine.length % limit === 0}
        loader={<h4>Scroll down to get more Operations</h4>}
        endMessage={
          <div style={{textAlign: "center"}}>
            {chipHistoryLine.length === 0 && <b>Empty Chip History</b>}
          </div>
        }
      >
        <div>
          <DefaultTable
            containerClassName={classes.historyTableContainer}
            tableClassName={classes.historyTable}
            headers={tableHeaders()}
            body={
              chipHistoryLine.map(line => {
                return (
                  <DefaultTableRow key={line.id}>
                    {roomRow(line).map((v, idx) => (
                      <DefaultTableCell key={idx}>{v}</DefaultTableCell>))}
                  </DefaultTableRow>)
              })
            }
          />
        </div>
      </InfiniteScroll>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default History