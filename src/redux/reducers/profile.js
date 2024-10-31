import {SET_PROFILE_USERNAME} from "../actions/profile";


const initialState = {
  profileUsername: null
}

export default function profile(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE_USERNAME:
      return {
        profileUsername: action.profileUsername
      }
    default:
      return state
  }
}