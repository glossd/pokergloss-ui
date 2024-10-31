import React, {useEffect, useState} from 'react'

import TableListWithPreview from "../../components/Lobby/StyledTable/TableListWithPreview";
import Header from "../../components/Header/Header";
import {connect} from "react-redux";
import Footer from "../../components/Footer/Footer";
import WelcomeSignUpPopup from "../../components/Lobby/WelcomeSignUpPopup";
import DailyPopup from "../../components/Lobby/DailyPopop/DailyPopup";
import {useTranslation} from "next-i18next";
import {clearLobby} from "../../redux/actions/lobby";
import {DefaultTab, DefaultTabs} from "../../components/UI/Tabs";
import Survival from "../../components/Lobby/Survival/Survival";
import {useRouter} from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import SEO from "../../components/SEO";

function LobbyPage({clearLobby, loading}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = router.query

  const [tabIdx, setTabIdx] = useState(typeToTabIdx(type))

  const handleTabChange = (event, newTabIdx) => {
    if (tabIdx !== newTabIdx) {
      clearLobby()
      setTabIdx(newTabIdx)
      router.push("/lobby/" + tabIdxToType(newTabIdx), undefined, { shallow: true })
    }
  }

  useEffect(() => {
    return () => {
      clearLobby()
    }
  }, [])

  return (
    <div>
      <div style={{flex: '1 0 auto'}}>
        <SEO title={`lobby.${tabIdxToType(tabIdx)}.title`} description={`lobby.${tabIdxToType(tabIdx)}.description`}/>
        <Header links={[{name: t("Header.Lobby")}]}/>
        <DefaultTabs
          className={`lobby-type-tabs ${tabIdx === 3 ? "absolute-tabs" : ""}`}
          value={tabIdx}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="lobby type tabs"
        >
          <DefaultTab label="Live" disabled={loading}/>
          <DefaultTab label="Sit & Go" disabled={loading}/>
          <DefaultTab label={t("lobby.Freerolls")} disabled={loading}/>
          <DefaultTab label={t("lobby.Survival")} disabled={loading}/>
        </DefaultTabs>

        <div className='lobby-tab-panel'>
          {
            tabIdx < 3 &&
            <TableListWithPreview key={tabIdx} lobbyType={tabIdxToType(tabIdx)}/>
          }
          {
            tabIdx === 3 &&
            <Survival/>
          }
        </div>

        <WelcomeSignUpPopup/>
        <DailyPopup/>
      </div>
      <Footer/>
    </div>
  );
}

function typeToTabIdx(type) {
  switch (type) {
    case "sitngo":
      return 1
    case 'multi':
      return 2
    case "survival":
      return 3
    case "live":
    default:
      return 0;
  }
}

function tabIdxToType(idx) {
  switch (idx) {
    case 1:
      return "sitngo"
    case 2:
      return 'multi'
    case 3:
      return "survival"
    case 0:
    default:
      return "live";
  }
}

function mapStateToProps(state) {
  return {
    loading: state.lobby.loading,
  }
}


export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {clearLobby})(LobbyPage)