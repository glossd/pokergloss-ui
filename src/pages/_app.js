import React, {useEffect} from "react";

import 'bootstrap/dist/css/bootstrap.css'

import '../index.css'
import '../components/UI/Tabs/Tabs.css'
import '../components/UI/DefaultSlider/DefaultSlider.css'
import '../components/UI/Fireworks/Fireworks.css'
import '../components/UI/CircularIndeterminate/CircularIndeterminate.css'
import '../components/UI/Button/SignButton/SignButton.css'
import '../components/UI/Button/ShineButton/ShineButton.css'
import '../components/UI/Button/BigTextButton/BigTextButton.css'
import '../components/UI/Button/DefaultButton/DefaultButton.css'
import '../components/UI/Loader/Loader.css'
import '../components/UI/TableSizeSelect/index.css'
import '../components/UI/TextShadow/TextShadow.css'
import '../components/Settings/UploadAvatar/UploadAvatar.css'
import '../components/Settings/ChangeUsername/ChangeUserName.css'
import '../components/Settings/ChangePassword/ChangePassword.css'
import '../components/Footer/Footer.css'
import '../components/MultiRoom/RoomPlayers/RoomPlayers.css'
import '../components/MultiRoom/MultiTablesPreview/MultiTablesPreview.css'
import '../components/Lobby/StyledTable/TableListWithPreview.css'
import '../components/Lobby/TablePreview/TablePreview.css'
import '../components/Lobby/Survival/SurvivalButton.css'
import '../components/Lobby/CreateTable/CreateTable.css'
import '../components/Messenger/animation.css'
import '../components/Medal/AchievementMedal.css'
import '../components/Table/TournamentInfo/TournamentInfo.css'
import '../components/Table/AllMultiRoomPlayers/AllMultiRoomPlayers.css'
import '../components/Table/Card/Card.css'
import '../components/Table/Card/MainContent.css'
import '../components/Table/Card/Flip.css'
import '../components/Table/Back/Back.css'
import '../components/Table/Chat/Chat.css'
import '../components/Table/TableUserList/TableUserList.css'
import '../components/Table/TablePokerActions/TablePokerActions.css'
import '../components/Table/TablePokerActions/Actions/Action.css'
import '../components/Table/TablePokerActions/Intents/Intents.css'
import '../components/Table/AddChips/AddChips.css'
import '../components/Table/CardCombinations/CardCombinations.css'
import '../components/Table/PokerTableV2/Chips.css'
import '../components/Table/PokerTableV2/UserPlateV2/Animation.css'
import '../components/Table/PokerTableV2/BuyIn.css'
import '../components/Table/PokerTableV2/PokerTable.css'
import '../components/Table/PokerTableV2/HandName/HandName.css'
import '../components/Table/TournamentPrizeDialog/TournamentPrizeDialog.css'
import '../components/market/BuyItemDialog.css'
import '../components/Header/Header.css'
import '../deprecated/SitngoRoomPage.css'
import '../deprecated/LobbyPage.css'
import '../deprecated/SettingsPage.css'
import '../deprecated/InventoryPage.css'
import '../deprecated/PurchaseListPage.css'
import '../deprecated/MultiTableRoomPage.css'
import '../deprecated/RatingPage.css'
import '../deprecated/TablePage.css'
import '../deprecated/SignPages.css'
import '../deprecated/ProfilePage.css'

import { Provider } from 'react-redux'
import { useStore } from '../store'
import TouranmentStartedNotification from "../components/notification/TournamentStartedNotification";
import DailyAssignmentsDialog from "../components/assignment/DailyAssignmentsDialog";
import NewLevelNotification from "../components/notification/NewLevelNotification";
import AchievementNotification from "../components/notification/AchievementNotification";
import AuthenticationUpdater from "../auth/AuthenticationUpdater";
import NewMessageNotification from "../components/notification/NewMessageNotificatoin";
import AssignmentNotification from "../components/notification/AssignmentNotification";
import NewsGiver from "../backend/wsUtil";
import {ThemeProvider} from "@material-ui/core";
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import theme from "../components/UI/theme";
import { appWithTranslation } from 'next-i18next';
import axios from "axios";
import {getCurrentUser, getIdToken} from "../auth/Firebase";
import * as ReactGA from "react-ga";
import Head from "next/head";
import {useRouter} from "next/router";

// https://github.com/mui-org/material-ui/issues/11843#issuecomment-534982194
const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true
});

/**
 * This axios interceptor adds Authorization header
 * with firebase idToken for each request to backend.
 * Resource link https://medium.com/@Mikepicker/authenticate-axios-requests-using-firebase-oauth-tokens-5c11d1482c17
 */
axios.interceptors.request.use(async config => {
  let user = await getCurrentUser()
  if (user !== null) {
    let idToken = await getIdToken(user)
    config.headers.Authorization = `Bearer ${idToken}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// Google Analytics
// https://levelup.gitconnected.com/using-google-analytics-with-react-3d98d709399b
const isProd = process.env.NODE_ENV && process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_DEV;
isProd && ReactGA.initialize("G-X4PTVTFNHC");
isProd && getCurrentUser().then(user => {
  user && ReactGA.set({userId: user.uid})
})


// https://stackoverflow.com/a/4673436/10160865
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)

  // https://mariestarck.com/add-google-analytics-to-your-next-js-application-in-5-easy-steps/
  if (isProd) {
    const router = useRouter()
    useEffect(() => {
      const handleRouteChange = (url) => {
        ReactGA.pageview(url);
      }
      //When the component is mounted, subscribe to router changes
      //and log those page views
      router.events.on('routeChangeComplete', handleRouteChange)
      // If the component is unmounted, unsubscribe
      // from the event with the `off` method
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [router.events])
  }

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>

            <title>Play Poker Online Free on PokerBlow</title>
            <meta name="description"
                  content="Free Texas Holdem Poker! Poker online right in your web browser, no download. Play against real people. PokerBlow is the most customizable poker you'll ever find."/>

            <meta name="keywords" content="poker, play poker, play poker online, play poker free, free poker, poker game, poker games"/>
          </Head>
          <Component {...pageProps} />
          <TouranmentStartedNotification/>
          <DailyAssignmentsDialog/>
          <NewLevelNotification/>
          <AchievementNotification/>
          <AuthenticationUpdater/>
          <NewMessageNotification/>
          <AssignmentNotification/>
          <NewsGiver/>
        </Provider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default appWithTranslation(App)