import {connect} from "react-redux";
import {clearTable, setFullscreen, setIsPageTop} from "../../redux/actions/table";
import {useRouter} from "next/router";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import React, {useEffect, useRef, useState} from "react";
import {deleteAllSubscribers, subscribeBefore, unsubscribe} from "../../redux/redux-subscribe-action";
import {disableFullScreen, enableFullScreen, themeIdStyles} from "./util";
import {isAndroid, isDesktop, isIOS, isMobile} from "react-device-detect";
import HandTap from "./FullScreen/HandTap";
import CursorPointer from "./FullScreen/CursorPointer";
import FullScreenSwitch from "./FullScreen/FullScreenSwitch";
import EntityWS from "../../backend/table-stream/entity-ws";
import TablePageHeader from "./TablePageHeader";
import TablePageBody from "./TablePageBody";
import useScrollLock from "use-scroll-lock";
import {useTranslation} from "next-i18next";
import PortraitTable from "./PokerTableV2/portrait/PortraitTable";

const FullTable = ({clearTable, isAuthenticated, isOffline, themeId, isFullscreen, setFullscreen, isPageTop, setIsPageTop}) => {
  const router = useRouter();
  const { id } = router.query
  const { t } = useTranslation();

  const isScreenTooSmall = useMediaQuery('(max-width:550px)', { noSsr: true });
  const isPortrait = useMediaQuery('(orientation: portrait)', { noSsr: true })
  const isLandscape = isMobile && !isPortrait;

  const ref = useRef(null);
  useScrollLock(!isPageTop, ref);

  const cleanUp = () => {
    deleteAllSubscribers()
    clearTable()
  }

  useEffect(() => {
    subscribeBefore("table-page", (action) => {
      if (action.type === "multiPlayerMove") {
        router.push("/tables/" + action.payload.tableId)
      }
    })
    if (isLandscape && isAndroid) {
      // case when you leave browser and then return
      // https://www.w3.org/TR/page-visibility/#examples-of-usage
      document.addEventListener("visibilitychange", () => {
        switch(document.visibilityState) {
          case "visible":
            // https://stackoverflow.com/a/7855739/10160865
            const isInFullscreen = !window.screenTop && !window.screenY;
            if (isInFullscreen) {
              setFullscreen(false)
            }
            break;
        }
      });
    }
    return () => {
      cleanUp()
      disableFullScreen()
      unsubscribe("table-page")
    }
  }, [])

  function rootStyles() {
    let result = {}

    if (themeId) {
      result.backgroundImage = `url('${themeIdStyles(themeId).background}')`
      result.backgroundSize = '100vw 100vh'
      result.backgroundPosition = 'center center'
    } else {
      result.background = 'rgb(7 15 20)'
    }

    return result
  }

  function turnOnAndroidFullScreen() {
    enableFullScreen()
    setFullscreen(true)
  }

  if (isOffline && isMobile && isPortrait) {
    return <PortraitTable/>
  }

  if (isMobile && isPortrait) {
    return <div className="screen-too-narrow">
        <img
          src="https://storage.googleapis.com/pokerblow/rotate-phone.png"
          className="invert-color"
          width='100px'
          height='100px'
          alt="rotate phone"/>
        <div className={"rotate-phone-text"}>{t("table.RotatePhone")}</div>
    </div>
  }

  if (isScreenTooSmall) {
    return <div className="screen-too-narrow">
      <p>Your screen is too narrow, try to make it wider</p>
    </div>
  }

  if (isLandscape && isIOS) {
    window.addEventListener('scroll', function () {
      if (isMobile && window.pageYOffset > 50) {
        setIsPageTop(false)
      } else {
        setIsPageTop(true)
      }
    });
  }

  if (isLandscape && isAndroid && !isFullscreen) {
    return (
      <div className='table-page-hand-tap-container' onClick={turnOnAndroidFullScreen}>
        <HandTap className='table-page-hand-tap'/>
      </div>
    )
  }

  return (
    <div className={isIOS ? 'table-page-height' : ''} ref={ref}>
      {
        isIOS && isMobile && isPageTop &&
        <div className='table-page-scroll-container'>
          <CursorPointer className={'table-page-cursor-pointer-img'}/>
        </div>
      }

      {isDesktop && <div className='full-screen-switch'><FullScreenSwitch/></div>}
      <div className="table-page-root user-select-none" style={rootStyles()}>
        {isAuthenticated != null && !isOffline && <EntityWS id={id} type="table"/>}
        <TablePageHeader/>
        <TablePageBody/>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  const {auth, tableWS} = state
  let table = tableWS.table;
  return {
    isAuthenticated: auth.isAuthenticated,
    themeId: table.themeId,
    isFullscreen: tableWS.isFullscreen,
    isOffline: tableWS.isOffline,
    isPageTop: tableWS.isPageTop,
  };
};


export default connect(mapStateToProps, {clearTable, setFullscreen, setIsPageTop})(FullTable);
