import {listSitNGoRooms, getTables, listMultiRooms} from "../../backend/table";
import {backendError} from "../../backend/error";

export const REQUEST_TABLES = 'REQUEST_TABLES'
export const ADD_RECEIVE_TABLES = 'ADD_RECEIVE_TABLES'
export const RECEIVE_FIRST_TABLES = 'RECEIVE_FIRST_TABLES'
export const CLEAR_LOBBY = 'CLEAR_LOBBY'

export const IS_JUST_SIGN_UP = 'GET_START_PACK'

export const SET_SURVIVAL_ANONYMOUS_DIALOG_OPEN = 'SET_SURVIVAL_ANONYMOUS_DIALOG_OPEN'
export const SET_SURVIVAL_NO_TICKETS_DIALOG_OPEN = 'SET_SURVIVAL_NO_TICKETS_DIALOG_OPEN'

export async function fetchTables(dispatch, lobbyType, isFirst, skip, limit, skipEmpty, skipFull ) {
  dispatch(requestTables());
  let tables
  switch (lobbyType) {
    case "sitngo":
      tables = await listSitNGoRooms(skip, limit, skipEmpty, skipFull)
        .catch(backendError)
      break
    case "multi":
      tables = await listMultiRooms(skip, limit)
        .catch(backendError)
      break
    case "live":
    default:
      tables = await getTables(skip, limit, skipEmpty, skipFull)
        .catch(backendError)
      break
  }
  dispatch(receiveTables(tables, isFirst))
}

function requestTables() {
  return {
    type: REQUEST_TABLES
  }
}

function receiveTables(tables, isFirst) {
  return {
    type: isFirst ? RECEIVE_FIRST_TABLES : ADD_RECEIVE_TABLES,
    tables
  }
}

export const setIsJustSignUp = (isJustSignUp) => ({
  type: IS_JUST_SIGN_UP,
  isJustSignUp
})

export const clearLobby = () => ({
  type: CLEAR_LOBBY
})

export const setSurvivalAnonymousDialogOpen = (open) => ({
  type: SET_SURVIVAL_ANONYMOUS_DIALOG_OPEN,
  open
})


export const setSurvivalNoTicketsDialogOpen = (open) => ({
  type: SET_SURVIVAL_NO_TICKETS_DIALOG_OPEN,
  open
})
