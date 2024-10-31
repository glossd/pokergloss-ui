import Header from "../Header/Header";
import React from "react";
import {connect} from "react-redux";
import {useTranslation} from "next-i18next";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SEO from "../SEO";

const TablePageHeader = ({tableType, tableName, tableTournamentAttrs}) => {
  const {t} = useTranslation();
  const isMobile = useMediaQuery('(max-device-width: 1224px)');

  const getLobbyRedirectTo = () => {
    if (!tableType) {
      return "/lobby/live"
    }
    switch (tableType) {
      case "sitAndGo":
        return "/lobby/sitngo"
      case "multi":
        return "/lobby/multi"
      default:
        return "/lobby/live"
    }
  }

  return (
    <div>
      {
        isMobile ?
          <div/> :
          <div className='poker-table-header'>

            {tableType === 'multi' ?
              <Header
                links={[
                  {name: t("Header.Lobby"), to: getLobbyRedirectTo()},
                  {name: (tableTournamentAttrs.name), to: `/lobby/multi/${tableTournamentAttrs.lobbyId}`},
                  {name: (tableName)},
                ]}/> :
              <Header
                links={[
                  {name: t("Header.Lobby"), to: getLobbyRedirectTo()},
                  {name: (tableName)},
                ]}/>
            }
          </div>
      }
    </div>
  )
}

const mapStateToProps = state => {
  const {tableWS} = state
  return {
    tableType: tableWS.table.type,
    tableName: tableWS.table.name,
    tableTournamentAttrs: tableWS.table.tournamentAttrs
  };
};

export default connect(mapStateToProps)(TablePageHeader)