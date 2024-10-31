import React from 'react'
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";
import {privacyPolicyText} from "../components/Footer/privacyPolicyText";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  privacyPolicyText: {
    color: 'white',
    padding: '1%'
  }
}));

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <div>
      <SEO title={"PrivacyPolicy.title"} description={"PrivacyPolicy.description"}/>
      <h1 className={classes.privacyPolicyText}>Privacy Policy</h1>

      <div className={classes.privacyPolicyText}>
        {privacyPolicyText()}
      </div>
    </div>
  );
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})
export default PrivacyPolicy