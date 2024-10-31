import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {
  ACTIONS_VISIBILITY,
  ALL_MULTI_PLAYERS,
  CLEAR_TABLE,
  CURRENT_USER_POSITION,
  OPEN_BUY_IN,
  POT_WIN, SET_AUTOCONFIG, SET_AUTOCONFIG_MUCK, SET_AUTOCONFIG_REBUY, SET_AUTOCONFIG_TOPUP,
  SET_BACKEND_ERROR,
  SET_CP_BETTING_CHIPS, SET_CURRENT_PLAYER_STATUS, SET_FULLSCREEN, SET_IS_CHIPS_IN_BB, SET_TABLE_OFFLINE, TABLE_STATUS,
  SET_IS_PAGE_TOP,
  SET_IS_SLIDER_HELD
} from "../actions/table";
import {currentUser} from "../../auth/Firebase";

const initialState = {
  table: {
    pot: 0
  },
  currentUserPosition: -1,
  openBuyIn: false,
  multiPlayers: new Map(),
  winningPositions: [],
  winningCards: [],
  backendError: '',
  cpBetting: {
    chips: 0,
    isAllIn: false
  },
  actionsVisibility: true,
  isChipsInBB: false,
  autoConfig: {
    autoMuck: false,
    autoTopUp: false,
    autoRebuy: false
  },
  status: null,
  isFullscreen: false,
  isPageTop: true,
  isOffline: false,
  isSliderHeld: false
};

export default function table(state = initialState, event) {
  switch (event.type) {
    case TABLE_STATUS: {
      return {
        ...state,
        status: event.status
      }
    }
    case SET_CP_BETTING_CHIPS: {
      return {
        ...state,
        cpBetting: {chips: event.chips, isAllIn: event.isAllIn}
      }
    }
    case CURRENT_USER_POSITION:
      return {
        ...state,
        currentUserPosition: event.position,
      };
    case SET_CURRENT_PLAYER_STATUS: {
      if (state.currentUserPosition >= 0) {
        const s = state.table.seats[state.currentUserPosition]
        const newPlayer = Object.assign({}, s.player, {status: event.status})
        return {...state, table: mergeTable(state.table, {seats:[{position: s.position, blind: s.blind, player: newPlayer}]})}
      }
      return state
    }
    case OPEN_BUY_IN:
      return {
        ...state,
        openBuyIn: event.open,
      };
    case CLEAR_TABLE:
      return initialState
    case SET_FULLSCREEN:
      return {...state, isFullscreen: event.fullscreen}
    case SET_IS_PAGE_TOP:
      return {...state, isPageTop: event.isPageTop}
    case POT_WIN:
      return {...state, winningPositions: event.winningPositions, winningCards: event.winningCards}
    case ALL_MULTI_PLAYERS:
      return {...state, multiPlayers: event.tableMap}
    case SET_IS_SLIDER_HELD:
      return {...state, isSliderHeld: event.isSliderHeld}
    case SET_BACKEND_ERROR: {
      return {
        ...state,
        backendError: event.backendError
      }
    }
    case ACTIONS_VISIBILITY: {
      return {
        ...state,
        actionsVisibility: event.visibility
      }
    }
    case SET_IS_CHIPS_IN_BB: {
      return {
        ...state,
        isChipsInBB: event.isChipsInBB
      }
    }
    case SET_TABLE_OFFLINE: {
      return {
        ...state,
        isOffline: event.isOffline
      }
    }
    case EventsTableEventTypeEnum.InitState: {
      return {
        ...state,
        table: event.payload.table,
      };
    }
    case "multiPlayersUpdate":
      return {
        ...state,
        multiPlayers: new Map(state.multiPlayers.set(event.payload.tableId, event.payload.players))
      }
    case "multiPlusPlayersUpdate": {
      let mp = state.multiPlayers
      const tid = event.payload.tableId
      return {
        ...state,
        multiPlayers: new Map(mp.set(tid, mp.get(tid).concat(event.payload.players)))
      }
    }

    case SET_AUTOCONFIG:
      return {
        ...state,
        autoConfig: event.anObject,
      };
    case EventsTableEventTypeEnum.SetPlayerConfig:
      return {
        ...state,
        autoConfig: event.payload.config,
      };
    case SET_AUTOCONFIG_MUCK:
      return {
        ...state,
        autoConfig: Object.assign(state.autoConfig, {autoMuck: event.aBool})
      }
    case SET_AUTOCONFIG_TOPUP:
      return {
        ...state,
        autoConfig: Object.assign(state.autoConfig, {autoTopUp: event.aBool})
      }
    case SET_AUTOCONFIG_REBUY:
      return {
        ...state,
        autoConfig: Object.assign(state.autoConfig, {autoRebuy: event.aBool})
      }

    case EventsTableEventTypeEnum.PlayerLeft:
      let openBuyIn = state.openBuyIn
      let currentUserPosition = state.currentUserPosition
      const position = event.payload.table.seats[0].position;
      if (state.currentUserPosition === position) {
        currentUserPosition = -1
        openBuyIn = false
      }
      return {
        ...state,
        openBuyIn, currentUserPosition,
        table: mergeTable(state.table, event.payload.table),
      };
    case EventsTableEventTypeEnum.SeatReserved: {
      let openBuyIn = state.openBuyIn
      let currentUserPosition = state.currentUserPosition
      let seat = event.payload.table.seats[0];
      if (currentUser().uid === seat.player.userId) {
        currentUserPosition = seat.position
        openBuyIn = true
      }
      return {
        ...state,
        openBuyIn,
        currentUserPosition,
        table: mergeTable(state.table, event.payload.table)
      };
    }
    case EventsTableEventTypeEnum.SeatReservationTimeout: {
      let openBuyIn = state.openBuyIn
      let currentUserPosition = state.currentUserPosition
      const position = event.payload.table.seats[0].position
      if (position === state.currentUserPosition) {
        openBuyIn = false
        currentUserPosition = -1
      }
      return {
        ...state,
        openBuyIn,
        currentUserPosition,
        table: mergeTable(state.table, event.payload.table)
      };
    }
    case EventsTableEventTypeEnum.TimeToDecide: {
      let cpBetting = state.cpBetting
      if (event.payload.table.decidingPosition === state.currentUserPosition) {
        cpBetting = {chips: 0, isAllIn: false}
      }
      return {
        ...state,
        cpBetting: cpBetting,
        table: mergeTable(state.table, event.payload.table)
      };
    }
    case EventsTableEventTypeEnum.PlayerAction: {
      return {
        ...state,
        actionsVisibility: true,
        table: mergeTable(state.table, event.payload.table)
      };
    }
    case EventsTableEventTypeEnum.Winners: {
      return {
        ...state,
        actionsVisibility: true,
        table: mergeTable(state.table, event.payload.table)
      };
    }
    case "sitngoInitState": {
      return {
        ...state,
        table: event.payload.table
      }
    }
    default: {
      if (!event.payload || !event.payload.table) {
        return state;
      }
      return {
        ...state,
        table: mergeTable(state.table, event.payload.table)
      };
    }
  }
}


export function mergeTable(oldTable, newTable) {
  if (newTable === undefined || newTable === null) {
    return oldTable
  }

  let mergedTable = {};
  Object.assign(mergedTable, oldTable, newTable);
  mergedTable.seats = oldTable.seats;
  if (newTable.seats) {
    if (!oldTable.seats) {
      mergedTable.seats = newTable.seats
      return mergedTable
    }
    newTable.seats.forEach(newSeat => {
      let position = newSeat.position;
      let oldSeat = oldTable.seats[position];
      let mergedSeat = {};
      Object.assign(mergedSeat, oldSeat, newSeat);
      mergedTable.seats[position] = mergedSeat;
      mergedTable.seats[position].player = oldSeat.player;
    })

    newTable.seats.filter(s => s.player !== undefined).forEach(newSeat => {
      let position = newSeat.position;
      let newPlayer = newSeat.player
      if (newPlayer === null) {
        mergedTable.seats[position].player = null
        return
      }

      let oldPlayer = oldTable.seats[position].player;
      let mergedPlayer = {};
      Object.assign(mergedPlayer, oldPlayer, newPlayer);
      mergedTable.seats[position].player = mergedPlayer
    });
  }
  return mergedTable
}
