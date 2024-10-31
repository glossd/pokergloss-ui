import {
  REQUEST_TOP_RATINGS,
  RECEIVE_TOP_RATINGS
} from '../actions/landing'

const initialState = {
  ratings: [],
  loading: false,
}

export default function landing(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOP_RATINGS:
      return {
        ...state, loading: true
      }
    case RECEIVE_TOP_RATINGS:
      return {
        ...state, loading: false, ratings: action.ratings
      }
    default:
      return state
  }
}