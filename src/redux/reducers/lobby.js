import {
  REQUEST_TABLES,
  ADD_RECEIVE_TABLES,
  RECEIVE_FIRST_TABLES,
  IS_JUST_SIGN_UP,
  CLEAR_LOBBY, SET_SURVIVAL_ANONYMOUS_DIALOG_OPEN, SET_SURVIVAL_NO_TICKETS_DIALOG_OPEN,
} from "../actions/lobby";

const initialState = {
  tables: [],
  loading: false,
  isJustSignUp: false,
  isSurvivalAnonymousDialogOpen: false,
  isSurvivalNoTicketsDialogOpen: false,
}

export default function lobby(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TABLES:
      return {
        ...state, loading: true
      }
    case ADD_RECEIVE_TABLES:
      return {
        ...state, loading: false, tables: state.tables.concat(action.tables)
      }
    case RECEIVE_FIRST_TABLES:
      return {
        ...state, loading: false, tables: action.tables
      }
    case CLEAR_LOBBY:
      return initialState

    case IS_JUST_SIGN_UP:
      return {
        ...state,
        isJustSignUp: action.isJustSignUp
      }
    case SET_SURVIVAL_ANONYMOUS_DIALOG_OPEN:
      return {...state, isSurvivalAnonymousDialogOpen: action.open}
    case SET_SURVIVAL_NO_TICKETS_DIALOG_OPEN:
      return {...state, isSurvivalNoTicketsDialogOpen: action.open}

    default:
      return state
  }
}