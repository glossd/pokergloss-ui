const initialState = {
  room: {}
}

export default function sitngoRoom(state = initialState, action) {
  switch (action.type) {
    case "sitngoInitState":
      return {
        ...state,
        room: action.payload.room,
      }
    default:
      return state
  }
}
