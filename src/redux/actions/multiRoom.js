export const CLEAR_MULTI_ROOM = 'CLEAR_MULTI_ROOM'
export const MULTI_ROOM_STATUS = 'MULTI_ROOM_STATUS'
export const UPDATE_MULTI_ROOM = 'UPDATE_MULTI_ROOM'

export const clearMultiRoom = () => ({
    type: CLEAR_MULTI_ROOM
})

export const multiRoomStatus = (status) => ({
    type: MULTI_ROOM_STATUS,
    status
})

export const updateMultiRoom = (room) => ({
    type: UPDATE_MULTI_ROOM,
    room
})