import {SET_SELECTED_ITEM_ID} from "../actions/inventory";

const initialState = {
  selectedItemId: null
}

export default function inventory(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_ITEM_ID:
      return {
        ...state, selectedItemId: action.selectedItemId
      }
    default:
      return state
  }
}