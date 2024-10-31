import {CLOSE_WS, SET_WS} from "../actions/table";

const initialState = {
  ws: null
}

export default function gameWs(state = initialState, action) {
  switch (action.type) {
    case SET_WS:
      if (state.ws) {
        state.ws.close()
      }
      return {...state, ws: action.ws};
    case CLOSE_WS:
      if (state.ws) {
        state.ws.close()
      }
      return {...state, ws: null};
    default:
      return state
  }
}