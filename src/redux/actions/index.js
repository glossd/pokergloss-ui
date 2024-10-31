
export const newTableEvent = event => ({
  type: event.type,
  payload: event.payload
});

export const newEvent = event => ({
  type: event.type,
  payload: event.payload
});

export const newBoolAction = (type, aBool) => ({
  type, aBool
})

export const newObjectAction = (type, anObject) => ({
  type, anObject
})