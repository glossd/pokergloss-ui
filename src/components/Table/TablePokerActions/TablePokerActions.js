import React from "react"

import Back from "../Back/Back";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Intents from "./Intents/Intents";
import BackendErrorMessage from "./BackendErrorMessage/BackendErrorMessage";
import Actions from "./Actions/Actions";
import {connect} from "react-redux";
import {ThemeProvider} from "@material-ui/styles";
import paradiseTheme from "./themes/paradiseTheme";
import spiritWorldTheme from "./themes/spiritWorldTheme";
import hellTheme from "./themes/hellTheme";
import defaultTheme from "./themes/defaultTheme";

const TablePokerActions = ({themeId}) => {
  const isMobile = useMediaQuery('(max-device-width: 1224px)')

  let actionsTheme = defaultTheme
  if (themeId) {
    switch (themeId) {
      case 'paradise':
        actionsTheme = paradiseTheme
        break
      case 'spirit-world':
        actionsTheme = spiritWorldTheme
        break
      case 'hell':
        actionsTheme = hellTheme
        break
    }
  }

  return (
    <ThemeProvider theme={actionsTheme}>
      <Actions/>
      <Intents/>
      <div className={`${isMobile ? 'back-button-mobile' : 'back-button-desktop'}`}>
        <Back />
      </div>
      <div className='backend-error-massage'>
        <BackendErrorMessage/>
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  let table = tableWS.table;
  return {
    themeId: table.themeId,
  };
};

export default connect(mapStateToProps)(TablePokerActions)