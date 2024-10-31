import React from 'react'
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import {makeStyles} from "@material-ui/core/styles";
import {termsOfUseText} from "../components/Footer/termsOfUseText";

const useStyles = makeStyles(() => ({
  termsOfUseText: {
    color: 'white',
    padding: '1%'
  }
}));

const TermsOfUse = () => {
  const classes = useStyles();

  return (
    <div>
      <SEO title={"TermsOfUse.title"} description={"TermsOfUse.description"}/>
      <h1 className={classes.termsOfUseText}>Terms Of Use</h1>

      <div className={classes.termsOfUseText}>
        {termsOfUseText()}
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})
export default TermsOfUse