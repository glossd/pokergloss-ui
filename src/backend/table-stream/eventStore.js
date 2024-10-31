// There can be only one instance of entityWS

import {EventsTableEventTypeEnum} from "@pokergloss/table-client-typescript";
import {COMMUNITY_CARDS} from "../../redux/actions/table";

const eventStore = []
let lastSetTimeoutId = null

// returns timeout
function handleNewCards(event, postEvent) {
  const oneTimeTimeout = 1250
  const allNewCards = event.payload.newCards
  const allCommunityCards = event.payload.table.communityCards
  let times = 0
  if (allNewCards.length === 1) {
    times = 1
  }
  if (allNewCards.length === 2) {
    times = 2
  }
  if (allNewCards.length === 5) {
    times = 3
  }

  for (let j = 0; j < times; j++) {
    let payload = {}
    if (j + 1 === times) {
      payload = {table: {communityCards: allCommunityCards}, newCards: [allNewCards[allNewCards.length - 1]]};
    }
    if (j + 2 === times) {
      payload = {
        table: {communityCards: allCommunityCards.slice(0, 4)},
        newCards: [allNewCards[allNewCards.length - 2]]
      };
    }
    if (j + 3 === times) {
      payload = {table: {communityCards: allCommunityCards.slice(0, 3)}, newCards: allNewCards.slice(0, 3)};
    }

    setTimeout(() => postEvent({type: COMMUNITY_CARDS, payload: payload}), j * oneTimeTimeout)
  }
  return times * oneTimeTimeout
}


export function addEvents(events, postEvent) {
  if (!events || events.length === 0) {
    return
  }

  const firstEventType = events[0].type
  const hasTimeout = firstEventType === EventsTableEventTypeEnum.PlayerAction || firstEventType === EventsTableEventTypeEnum.Reset
  if (lastSetTimeoutId && hasTimeout) {
    clearTimeout(lastSetTimeoutId)
    eventStore.flatMap(arr => arr).forEach(postEvent)
    lastSetTimeoutId = null
    eventStore.splice(0, eventStore.length)
  }

  const idx = eventStore.push(events);

  const processEvents = (events) => {
    const entityEvent = events.splice(0, 1)[0];
    postEvent(entityEvent)
    const nextTableEvent = events[0]
    if (!nextTableEvent) {
      eventStore.splice(idx, 1)
      lastSetTimeoutId = null
      return
    }

    if (isBlinds(entityEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 500)
      return
    }
    if (isHoleCards(entityEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 500)
      return
    }

    if (isShowdown(nextTableEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 200)
      return
    }

    if (isNewRound(nextTableEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 500)
      return
    }

    if (isWinnersWithNewCards(nextTableEvent)) {
      const timeout = handleNewCards(nextTableEvent, postEvent);
      lastSetTimeoutId = setTimeout(() => processEvents(events), timeout)
      return
    }
    if (isWinners(nextTableEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 500)
      return
    }

    if (isTimeToDecide(nextTableEvent) && isNewRound(entityEvent)) {
      lastSetTimeoutId = setTimeout(() => processEvents(events), 500)
      return
    }
    processEvents(events)
  }
  processEvents(events)
}

function isBlinds(event) {
  return event.type === EventsTableEventTypeEnum.Blinds
}

function isHoleCards(event) {
  return event.type === EventsTableEventTypeEnum.HoleCards
}

function isShowdown(event) {
  return event.type === EventsTableEventTypeEnum.ShowDown
}

function isWinners(event) {
  return event.type === EventsTableEventTypeEnum.Winners
}

function isWinnersWithNewCards(event) {
  if (event.type === EventsTableEventTypeEnum.Winners) {
    let newCards = event.payload.newCards;
    return newCards && newCards.length > 0
  }
  return false
}

function isNewRound(event) {
  return event.type === EventsTableEventTypeEnum.NewBettingRound
}

function isTimeToDecide(event) {
  return event.type === EventsTableEventTypeEnum.TimeToDecide
}

