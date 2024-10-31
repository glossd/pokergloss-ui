import {SET_CURRENT_PACK} from "../actions/acquiring";

const initialState = {
  currentPack: null
}

export default function acquiring(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_PACK:
      return {
        ...state, currentPack: action.currentPack
      }
    default:
      return state
  }
}