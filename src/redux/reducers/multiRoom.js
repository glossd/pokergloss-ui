import {currentUser} from "../../auth/Firebase";
import React from "react";
import {CLEAR_MULTI_ROOM, MULTI_ROOM_STATUS, UPDATE_MULTI_ROOM} from "../actions/multiRoom";

const initialState = {
  room: {players:[]},
  isRegistered: false,
  status: 200
}

export default function multiRoom(state = initialState, event) {

  let isRegister = state.isRegistered

  switch (event.type) {

    case CLEAR_MULTI_ROOM: {
      return initialState
    }

    case 'multiInit': {
      isRegister = false
      let room = state.room
      if (event.payload) {
        room = event.payload
        for (let player of event.payload.players) {
          let playerId = player.userId
          const user = currentUser()
          if (user && user.uid === playerId) {
            isRegister = true
          }
        }
      }

      return {
        ...state,
        room: room,
        isRegistered: isRegister,
      }
    }

    case MULTI_ROOM_STATUS: {
      return {
        ...state,
        status: event.status
      }
    }

    case UPDATE_MULTI_ROOM: {
      return {
        ...state,
        room: event.room
      }
    }

    case 'multiRegister': {
      const user = currentUser()
      if (user && event.payload.player.userId === user.uid) {
        isRegister = true
      }
      return {
        ...state,
        room: {
          ...state.room,
          players: [...state.room.players, event.payload.player],
          prizes: event.payload.prizes
        },
        isRegistered: isRegister
      }
    }

    case 'multiUnregister': {
      const user = currentUser()
      if (user && event.payload.player.userId === user.uid) {
        isRegister = false
      }

      return {
        ...state,
        room: {
          ...state.room,
          players: state.room.players.filter(player => player.userId !== event.payload.player.userId),
          prizes: event.payload.prizes
        },
        isRegistered: isRegister
      }
    }
    case 'multiLobby': {
      return {...state, room: event.payload.lobby}
    }
    default:
      return state
  }
}