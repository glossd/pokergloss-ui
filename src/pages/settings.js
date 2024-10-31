import React from 'react'
import VerticalTabs from "../components/Settings/VerticalTabs/VerticalTabs";
import Header from "../components/Header/Header";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

function Settings() {
  const { t } = useTranslation();

  return (
    <div>
      <SEO title={"Settings.title"} description={"Settings.description"}/>
      <div>
        <Header
          links={[
            {name: t("Header.Lobby"), to: '/lobby/live'},
            {name: t("Header.Settings"), to: '/settings'},
          ]}
        />
        <VerticalTabs/>
      </div>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default Settings