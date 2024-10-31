import {avatarUrlOrDefault} from "../../../auth";
import React, {useEffect, useState} from "react";

import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import DefaultButton from "../../UI/Button/DefaultButton/DefaultButton";
import DefaultTableCell from "../../UI/DefaultTable/DefaultTableCell";
import DefaultTableRow from "../../UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../../UI/DefaultTable/DefaultTable";

const MultiTablesPreview = ({tables}) => {

  const {t} = useTranslation();
  const router = useRouter()

  const [selectedTable, setSelectedTable] = useState('')
  const [isUserSelectedTable, setIsUserSelectedTable] = useState(false)

  useEffect(() => {
    if (tables && tables.length !== 0 && isUserSelectedTable === false) {
      setSelectedTable(tables[0])
    }
  })

  function showTablePreview(selectedTable) {
    setSelectedTable(selectedTable)
    setIsUserSelectedTable(true)
  }

  function openTablePage(tableId) {
    router.push(`/tables/${tableId}`)
  }

  function playersInTheSelectedTable(seats) {
    let players = []
    for (let seat of seats) {
      if (seat.player !== null) {
        players.push(seat.player)
      }
    }
    return players
  }

  let headers = [t("MultiPage.TablesPreview.Table"), t("MultiPage.TablesPreview.Players"),
    t("MultiPage.TablesPreview.Blinds")]

  return (
    <div className='multi-table-preview'>
      {
        tables && tables.length !== 0 &&
        <div className='multi-table-preview-tables'>
          <DefaultTable
            headers={headers}
            body={
              tables.map((table) => {
                const isSelected = table.id === selectedTable.id
                return (
                  <DefaultTableRow
                    key={table.id}
                    onClick={() => showTablePreview(table)}
                    onDoubleClick={() => openTablePage(table.id)}
                    className={`${isSelected ? "selected-table" : ""}`}
                  >
                    <DefaultTableCell>{table.name}</DefaultTableCell>
                    <DefaultTableCell>
                      {playersInTheSelectedTable(table.seats).length}
                    </DefaultTableCell>
                    <DefaultTableCell>
                      {table.bigBlind / 2 + "/" + table.bigBlind}
                    </DefaultTableCell>
                  </DefaultTableRow>
                )
              })
            }
          />
          <div className='multi-open-table-btn'>
            <DefaultButton
              onClick={() => openTablePage(selectedTable.id)}>{t("MultiPage.TablesPreview.OpenTable")}</DefaultButton>
          </div>
        </div>
      }
      <div className='multi-table-preview-players'>
        {
          tables && tables.length !== 0 && selectedTable !== '' &&
          <div>
            {playersInTheSelectedTable(selectedTable.seats).map((player) => {
              return (
                <div key={player.userId} className={'multi-table-player'}>
                  <img className='multi-table-player-picture multi-table-player-indent'
                       src={avatarUrlOrDefault(player.picture)} alt="loading"/>
                  <div className='multi-table-player-indent'>
                    {player.username}
                  </div>
                </div>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}

export default MultiTablesPreview