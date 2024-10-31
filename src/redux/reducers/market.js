import {CLEAR_MARKET, SET_CURRENT_ITEM, SET_CURRENT_PRODUCT} from "../actions/market";

const initialState = {
  currentItem: null,
  currentProduct: null
}

export default function market(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_ITEM:
      return {
        ...state, currentItem: action.currentItem
      }
    case SET_CURRENT_PRODUCT:
      return {
        ...state, currentProduct: action.currentProduct
      }
    case CLEAR_MARKET:
      return initialState
    default:
      return state
  }
}