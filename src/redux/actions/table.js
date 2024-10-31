
export const CURRENT_USER_POSITION = 'CURRENT_USER_POSITION'
export const CLEAR_TABLE = 'CLEAR_TABLE'
export const SET_FULLSCREEN = 'SET_FULLSCREEN'
export const SET_IS_PAGE_TOP = 'SET_IS_PAGE_TOP'
export const OPEN_BUY_IN = 'OPEN_BUY_IN'
export const SET_WS = 'SET_WS'
export const CLOSE_WS = 'CLOSE_WS'
export const POT_WIN = 'POT_WIN'
export const COMMUNITY_CARDS = 'COMMUNITY_CARDS'
export const SET_BACKEND_ERROR = 'SET_BACKEND_ERROR'
export const ALL_MULTI_PLAYERS = 'ALL_MULTI_PLAYERS'
export const SET_CP_BETTING_CHIPS = 'SET_CP_BETTING_CHIPS'
export const ACTIONS_VISIBILITY = 'ACTIONS_VISIBILITY'
export const SET_IS_CHIPS_IN_BB = 'SET_IS_CHIPS_IN_BB'

export const SET_AUTOCONFIG = 'SET_AUTOCONFIG'
export const SET_AUTOCONFIG_MUCK = 'SET_AUTOCONFIG_MUCK'
export const SET_AUTOCONFIG_TOPUP = 'SET_AUTOCONFIG_TOPUP'
export const SET_AUTOCONFIG_REBUY = 'SET_AUTOCONFIG_REBUY'

export const SET_TABLE_OFFLINE = "SET_TABLE_OFFLINE"

export const TABLE_STATUS = 'TABLE_STATUS'

export const SET_IS_SLIDER_HELD = 'SET_IS_SLIDER_HELD'

export const tableStatus = (status) => ({
  type: TABLE_STATUS,
  status
})

export const SET_CURRENT_PLAYER_STATUS = 'SET_CURRENT_PLAYER_STATUS'

export const setCurrentUserPosition = (position) => ({
  type: CURRENT_USER_POSITION,
  position
})

export const setOpenBuyIn = (open) => ({
  type: OPEN_BUY_IN,
  open
})

export const clearTable = () => ({
  type: CLEAR_TABLE
})

export const setFullscreen = (fullscreen) => ({
  type: SET_FULLSCREEN, fullscreen
})

export const setIsPageTop = (isPageTop) => ({
  type: SET_IS_PAGE_TOP, isPageTop
})

export const setActionsVisibility = (visibility) => ({
  type: ACTIONS_VISIBILITY, visibility
})

export const setIsChipsInBB = (isChipsInBB) => ({
  type: SET_IS_CHIPS_IN_BB, isChipsInBB
})

export const setWs = (ws) => ({
  type: SET_WS,
  ws
})

export const closeWs = () => ({
  type: CLOSE_WS
})

export const setPotWin = (winningPositions, winningCards) => ({
  type: POT_WIN,
  winningPositions,
  winningCards,
})

export const setBackendError = (backendError) => ({
  type: SET_BACKEND_ERROR,
  backendError
})

export const setCpBetting = (chips, isAllIn = false) => ({
  type: SET_CP_BETTING_CHIPS, chips, isAllIn
})

export const setTableOffline = (isOffline) => ({
  type: SET_TABLE_OFFLINE, isOffline
})

export const setCurrentPlayerStatus = (status) => ({type: SET_CURRENT_PLAYER_STATUS, status})

export const setAllMultiPlayers = (multiRoom) => {
  let tableMap = new Map();
  for (let table of multiRoom.tables) {
    if (table.seats) {
      tableMap.set(table.id, table.seats.filter(s => s.player).map(s => s.player))
    }
  }
  return {
    type: ALL_MULTI_PLAYERS,
    tableMap
  }
}

export const setIsSliderHeld = (isSliderHeld) => {
  return {
    type: SET_IS_SLIDER_HELD,
    isSliderHeld
  }
}