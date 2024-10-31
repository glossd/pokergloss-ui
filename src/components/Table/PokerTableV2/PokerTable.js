import React from "react";
import {connect} from "react-redux";

import {height, setToDesktopSizes, setToMobileSizes, width} from "../../util/tableSeatsMath";
import Pots from "./pot/Pots";
import CommunityCards from "./CommunityCards";
import BuyIn from "./BuyIn";
import UserPlates from "./UserPlates";
import PotWinCards from "./pot/PotWinCards";
import TotalPot from "./TotalPot";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {makeStyles} from "@material-ui/core/styles";
import SoundSwitch from "./SoundSwitch";
import Blinds from "./Blinds";
import {themeIdStyles} from "../util";
import MusicSwitch from "./MusicSwitch";

const defaultStyles = makeStyles(() => ({
  tableEdges: {
    backgroundImage: "url('https://storage.googleapis.com/pokerblow/poker-table/black-wood.jpg')",
    border: 'solid 1px #100000',
    position: 'absolute',
  },
  positionAbsolute: {
    position: 'absolute',
  },
  tableMaterial: {
    background: '#1b6f33',
    boxShadow: 'inset 0 0 4em 2em black',
    border: '1vw solid #0a0909',
    position: 'absolute',
  }
}))

const goldStyles = makeStyles(() => ({
  tableEdges: {
    backgroundImage: "url('https://storage.googleapis.com/pokerblow/poker-table/gold.jpg')",
    border: 'solid 1px #100000',
    position: 'absolute',
  },
  positionAbsolute: {
    position: 'absolute',
  },
  tableMaterial: {
    background: '#692323',
    boxShadow: 'inset 0 0 4em 2em black',
    border: '1vw solid #1d1404',
    position: 'absolute',
  }
}))

const firstBorderRadius = 18
const radiusRatio = 18 / 20
const outerTableRatio = 74 / 70


const PokerTable = ({tableType, pageType, isAuthenticated, bigBlind, themeId}) => {
  let classes
  if (bigBlind >= 100 && tableType === 'cashGame') {
    classes = goldStyles()
  } else {
    classes = defaultStyles()
  }

  const isMobile = useMediaQuery('(max-device-width: 1224px)')

  isMobile ? setToMobileSizes(pageType) : setToDesktopSizes()

  const pokerTableStyles = {
    width: `${width}vw`,
    height: `${height}vw`,
    borderRadius: `${firstBorderRadius}vw / ${firstBorderRadius / radiusRatio}vw`,
  }

  const outerTableStyles = {
    width: `${width * outerTableRatio}vw`,
    height: `${height * outerTableRatio}vw`,
    borderRadius: `${firstBorderRadius * outerTableRatio}vw / ${firstBorderRadius / radiusRatio * outerTableRatio}vw`,
  }

  if (themeId) {
    pokerTableStyles.backgroundImage = `url('${themeIdStyles(themeId).tableMaterial}')`
    pokerTableStyles.backgroundSize = 'cover'

    outerTableStyles.backgroundImage = `url('${themeIdStyles(themeId).tableEdges}')`
  }

  const isLoaded = () => {
    return !!tableType
  }

  const isAvailable = () => {
    return isLoaded() && isAuthenticated
  }

  const isRingType = () => {
    if (!tableType) {
      return true // backward compatibility
    }
    return tableType === "cashGame"
  }

  return (
    <div className="poker-table-v2-root">
      <div className={isLoaded() ? classes.tableEdges : classes.positionAbsolute} style={outerTableStyles}/>

      <div className="table-logo-root">
        <img className='table-logo' src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png" alt="logo"/>
      </div>

      <PotWinCards/>

      <div className={isLoaded() ? classes.tableMaterial : classes.positionAbsolute} style={pokerTableStyles}>
        <div className="table-pots-root">
          <div className="center-left">
            <Pots/>
          </div>
        </div>
        <div className='table-total-pot'>
          <div className='center-top-and-left'>
            <TotalPot/>
          </div>
        </div>
        <div className="table-community-cards-root">
          <div className="center-left">
            <CommunityCards/>
          </div>
        </div>
        <div className="table-blinds">
          <div className="center-left">
            <Blinds/>
          </div>
        </div>
        <div className="user-plates-v2">
          {
            isLoaded() && <UserPlates pageType={pageType}/>
          }
        </div>
      </div>
      <div className='sound-switch'>
        {pageType !== 'sitngo' && <SoundSwitch/>}
        {
          themeId && <MusicSwitch/>
        }
      </div>
      {isAvailable() && isRingType() && <BuyIn/>}
    </div>
  )
}

const mapStateToProps = state => {
  const { tableWS, auth } = state
  let table = tableWS.table;
  return {
    tableType: table.type,
    themeId: table.themeId,
    bigBlind: table.bigBlind,
    currentUserPosition: tableWS.currentUserPosition,
    isAuthenticated: auth.isAuthenticated};
};

export default connect(mapStateToProps)(PokerTable)