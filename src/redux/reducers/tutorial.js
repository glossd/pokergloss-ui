import {
  emptyGirl,
  emptyPokerCombinations,
  SET_TUTORIAL_ACTION,
  SET_TUTORIAL_GIRL,
  SET_TUTORIAL_POKER_COMBINATIONS
} from "../actions/tutorial";

const initialState = {
  action: null,
  girl: emptyGirl,
  pokerCombinations: emptyPokerCombinations
}

export default function tutorial(state = initialState, action) {
  switch (action.type) {
    case SET_TUTORIAL_ACTION:
      return {
        ...state,
        action: action.action
      }
    case SET_TUTORIAL_GIRL:
      return {
        ...state,
        girl: action.girl
      }
    case SET_TUTORIAL_POKER_COMBINATIONS:
      return {
        ...state,
        pokerCombinations: action.pokerCombinations
      }
    default:
      return state
  }
}