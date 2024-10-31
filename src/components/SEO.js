import Head from "next/head";
import React from "react";
import {useTranslation} from "next-i18next";

function SEO({ title = "title", titleTranslated, description = "description", keywords = "keywords", lang, meta}) {
  const {t} = useTranslation();
  const titleVal = titleTranslated ? titleTranslated : t(title)
  const descriptionVal = t(description)
  const keywordsVal = t(keywords)
  return (
    <Head>
      <title>{titleVal} | PokerBlow</title>
      <meta name="description" content={descriptionVal}/>
      <meta name="og:title" content={descriptionVal}/>
      <meta name="og:description" content={descriptionVal}/>
      <meta name="og:type" content="website"/>
      <meta name="twitter:title" content={titleVal}/>
      <meta name="twitter:card" content={"summary"}/>
      <meta name="twitter:creator" content={"@pokerblow"}/>
      <meta name="twitter:description" content={descriptionVal}/>
      <meta name="keywords" content={keywordsVal}/>
    </Head>

  )
}

export default SEO