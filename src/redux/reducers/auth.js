import {LOG_OUT, SET_IS_ANONYMOUS, SET_IS_AUTHENTICATED, SET_IS_EMAIL_VERIFIED} from "../actions/auth";

const initialState = {
  isAuthenticated: null,
  isEmailVerified: null,
  isAnonymous: null,
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SET_IS_AUTHENTICATED:
      return {...state, isAuthenticated: action.isAuthenticated}
    case SET_IS_EMAIL_VERIFIED:
      return {...state, isEmailVerified: action.isEmailVerified}
    case SET_IS_ANONYMOUS:
      return {...state, isAnonymous: action.isAnonymous}
    case LOG_OUT:
      return {isAuthenticated: false, isEmailVerified: false, isAnonymous: false}
    default:
      return state
  }
}