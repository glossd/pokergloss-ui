import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import FullTable from "../components/Table/FullTable";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import SEO from "../components/SEO";
import Girl from "../components/tutorial/Girl";
import {clearTable, setFullscreen, setIsPageTop, setTableOffline} from "../redux/actions/table";
import FirstTutorial from "../components/tutorial/firstTutorial";
import SecondTutorial from "../components/tutorial/secondTutorial";
import PokerHands from "../components/tutorial/PokerHands";
import {isAndroid, isIOS, isDesktop, isMobile} from "react-device-detect";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ThirdTutorial from "../components/tutorial/thirdTutorial";
import FourthTutorial from "../components/tutorial/fourthTutorial";
import FifthTutorial from "../components/tutorial/fifthTutorial";
import {clearGirl} from "../redux/actions/tutorial";

const Tutorial = ({setTableOffline, isFullscreen, isPageTop, clearTable, setFullscreen, setIsPageTop, clearGirl}) => {
  const isPortrait = useMediaQuery('(orientation: portrait)')

  const router = useRouter();
  const isReady = router.isReady

  const [version, setVersion] = useState(0)

  function isNumeric(num){
    return !isNaN(num)
  }

  function getTutorialNumber() {
    const num = localStorage.getItem("tutorial.number")
    if (isNumeric(num) && Number(num) > 0 && Number(num) <= 5) {
      return num
    }
    return "1"
  }

  function incTutorial() {
    setTutorialNumber(Number(getTutorialNumber())+1)
  }

  function setTutorialNumber(num) {
    localStorage.setItem("tutorial.number", num)
  }

  useEffect(() => {
    setTableOffline(true)
  }, [version])

  function isComponentReady() {
    if (!isReady) {
      return false
    }
    if (isMobile && isPortrait) {
      return true
    }
    return (
      isDesktop ||
      (isAndroid && isFullscreen && !isPortrait) ||
      (isIOS && isMobile && !isPageTop && !isPortrait)
    )
  }

  const goNext = () => {
    clearGirl()
    clearTable()
    // clear table set isFullscreen to false
    if (isAndroid) {
      setFullscreen(true)
    }
    // clear table set isPageTop to true
    if (isIOS) {
      setIsPageTop(false)
    }
    setVersion(version+1)
  }
  const getTutorial = () => {
    switch (getTutorialNumber()) {
      case "5":
        return <FifthTutorial goNext={goNext} inc={incTutorial}/>
      case "4":
        return <FourthTutorial goNext={goNext} inc={incTutorial}/>
      case "3":
        return <ThirdTutorial goNext={goNext} inc={incTutorial}/>
      case "2":
        return <SecondTutorial goNext={goNext} inc={incTutorial}/>
      case "1":
      default:
        return <FirstTutorial goNext={goNext} inc={incTutorial}/>
    }
  }

  return (
    <>
      <SEO title={"tutorial.title"} description={"tutorial.description"}/>
      {isComponentReady() && <Girl/>}
      {isComponentReady() && <PokerHands/>}
      {isReady && getTutorial()}
      {isReady && <FullTable/>}
    </>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    isFullscreen: tableWS.isFullscreen,
    isPageTop: tableWS.isPageTop,
  };
};

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(mapStateToProps, {setTableOffline, clearTable, clearGirl, setFullscreen, setIsPageTop}) (Tutorial)
