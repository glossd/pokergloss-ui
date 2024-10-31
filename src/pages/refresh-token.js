import React, {useEffect} from "react";
import {forceRefreshIdToken} from "../auth/Firebase";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

// After email verification, id token has email_verified=false
// For more info https://stackoverflow.com/a/47281903/10160865

const RefreshToken = () => {
  const router = useRouter();
  useEffect(() => {
    forceRefreshIdToken()
      .then(() => {
        router.push("/lobby/live")
      }).catch(() => {
      router.push("/lobby/live")
    })
  }, [])
  return <div/>
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default RefreshToken