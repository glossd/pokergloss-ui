import React from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import FullTable from "../../components/Table/FullTable";
import SEO from "../../components/SEO";

const TablePage = () => {
  return (
    <>
      <SEO title={"table.title"} description={"table.description"}/>
      <FullTable/>
    </>
  )
}

export const getServerSideProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default TablePage