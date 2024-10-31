import {
  ModelPlayerBlindEnum,
  ModelPlayerLastGameActionEnum,
  ModelPlayerStatusEnum
} from "@pokergloss/table-client-typescript";
import React from "react";

function isCurrentUserPlaying(position) {
  return position >= 0;
}

export function getCurrentUserPlayer(table, position) {
  if (table && table.seats && isCurrentUserPlaying(position)) {
    let seat = table.seats[position];
    if (seat && seat.player) {
      return seat.player
    }
  }
  return null
}

export function getCurrentUserPlayerSafe(table, position) {
  if (table && table.seats && isCurrentUserPlaying(position)) {
    let seat = table.seats[position];
    if (seat && seat.player) {
      return seat.player
    }
  }
  return {}
}

export function getPosition(table, userId) {
  let seats = table.seats.filter(s => s.player && s.player.userId === userId)
  if (seats.length === 0) {
    return -1
  }
  return seats[0].position
}

export function nextDecidablePlayer(table, position) {
  for (let i = position + 1; i < table.seats.length; i++) {
    let seat = table.seats[i]
    if (isDecidable(seat.player)) {
      return seat.player
    }
  }

  for (let i = 0; i < position; i++) {
    let seat = table.seats[i]
    if (isDecidable(seat.player)) {
      return seat.player
    }
  }
  return null
}

export function isDecidable(player) {
  return player
    && player.status === ModelPlayerStatusEnum.Playing
    && player.lastGameAction !== ModelPlayerLastGameActionEnum.Fold
    && player.lastGameAction !== ModelPlayerLastGameActionEnum.AllIn
}

export function getBlindPositions(seats) {
  let bigBlind = -1
  let smallBlind = -1
  let dealer = -1
  if (seats) {
    seats.filter(s => s.blind !== "").forEach(s => {
      switch (s.blind) {
        case ModelPlayerBlindEnum.BigBlind:
          bigBlind = s.position
          break
        case ModelPlayerBlindEnum.SmallBlind:
          smallBlind = s.position
          break
        case ModelPlayerBlindEnum.DealerSmallBlind:
        case ModelPlayerBlindEnum.Dealer:
          dealer = s.position
      }
    })
  }
  return {bigBlind, smallBlind, dealer}
}

export function dealerPosition(table) {
  let seat = table.seats.find(s => s.blind === ModelPlayerBlindEnum.Dealer || s.blind === ModelPlayerBlindEnum.DealerSmallBlind);
  if (!seat) {
    return -1
  }
  return seat.position
}

export function bigBlindPosition(table) {
  let seat = table.seats.find(s => s.blind === ModelPlayerBlindEnum.BigBlind);
  if (!seat) {
    return -1
  }
  return seat.position
}

export function isOthersAllIn(table, player) {
  const others = allOtherPlayers(table, player)
  const gamingPlayers = others.filter(p => p.status === "playing" && p.lastGameAction !== "fold")
  const allInPlayers = others.filter(p => p.status === "playing" && p.lastGameAction === "allIn")
  return gamingPlayers.length === allInPlayers.length;
}

export const isForceAllIn = (cp, maxRoundBet) => maxRoundBet >= (cp.stack + cp.totalRoundBet)

export const isForceCall = (cp, table) => (cp.totalRoundBet + cp.stack > table.maxRoundBet) && isOthersAllIn(table, cp)

/**
 * isForced cases - (fold and call), (fold and all-in)
 */
export const availableBettingActions = (cp, table, isCpAllIn) => {
  const isSomeoneBetBefore = table.maxRoundBet > 0
  let isForced = false
  let actions = []

  if (table.decidingPosition !== cp.position) {
    return {actions, isForced}
  }

  actions.push(ModelPlayerLastGameActionEnum.Fold);
  if (isForceAllIn(cp, table.maxRoundBet)) {
    isForced = true
    actions.push(ModelPlayerLastGameActionEnum.AllIn)
  } else if (isForceCall(cp, table)) {
    isForced = true
    actions.push(ModelPlayerLastGameActionEnum.Call)
  } else {
    if (isSomeoneBetBefore) {
      if (cp.totalRoundBet === table.maxRoundBet) {
        actions.push(ModelPlayerLastGameActionEnum.Check)
      } else {
        actions.push(ModelPlayerLastGameActionEnum.Call)
      }
      if (isCpAllIn) {
        actions.push(ModelPlayerLastGameActionEnum.AllIn)
      } else {
        actions.push(ModelPlayerLastGameActionEnum.Raise)
      }
    } else {
      actions.push(ModelPlayerLastGameActionEnum.Check)
      if (isCpAllIn) {
        actions.push(ModelPlayerLastGameActionEnum.AllIn)
      } else {
        actions.push(ModelPlayerLastGameActionEnum.Bet)
      }
    }
  }
  return {isForced, actions}
}

function allOtherPlayers(table, player) {
  return table.seats.filter(s => s.player && s.player.position !== player.position).map(s => s.player)
}

// PS: PokerSolver
export function adaptPokerSolverCard(card) {
  let result = card

  if (card.startsWith('10')) {
    let shortSuit = card.charAt(2)
    result = 'T' + shortSuit
  }

  if (card.length === 2 && card.startsWith('1')) {
    result = ('A' + card.charAt(1))
  }

  return result
}

export function areUnique(entities) {
  return new Set(entities).size === entities.length
}

export function isSomeoneBetBeforeV2(cp, maxRoundBet) {
  if (cp) {
    return cp.totalRoundBet < maxRoundBet
  }
  return false
}


export function minBettingChipsV2(cp, bigBlind, maxRoundBet) {
  if (!cp) {
    return 0
  }
  if (isSomeoneBetBeforeV2(cp, maxRoundBet)) {
    if (cp.stack >= maxRoundBet * 2 - cp.totalRoundBet) {
      return Math.max(
        2*bigBlind-cp.totalRoundBet, // case when player with bigBlind has less chips then bigBlind
        maxRoundBet*2-cp.totalRoundBet)
    } else {
      return cp.stack
    }
  } else {
    if (cp.stack >= bigBlind) {
      return bigBlind
    } else {
      return cp.stack
    }
  }
}

export function adaptChipsToBB(chips, bigBlind) {
  return (chips/bigBlind).toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "") + ' BB'
}

export function enableFullScreen() {
  if (!document.fullscreenEnabled) {
    return
  }
  // https://hacks.mozilla.org/2012/01/using-the-fullscreen-api-in-web-browsers/
  var docElm = document.documentElement;
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen().catch(console.error);
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  }
}

export function disableFullScreen() {
  if (!document.fullscreenEnabled) {
    return
  }
  if (document.fullscreen) {
    document.exitFullscreen().catch(console.error);
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

export function themeIdStyles(themeId) {
  switch (themeId) {
    case 'paradise':
      return {
        background: 'https://storage.googleapis.com/pokerblow/story/paradise/clouds-background.jpg',
        tableEdges: 'https://storage.googleapis.com/pokerblow/story/paradise/gold-edges.jpg',
        tableMaterial: 'https://storage.googleapis.com/pokerblow/story/paradise/clouds-table.jpg',
      }
    case 'spirit-world':
      return {
        background: 'https://storage.googleapis.com/pokerblow/story/spirit-world/ghost-room.jpg',
        tableEdges: 'https://storage.googleapis.com/pokerblow/story/spirit-world/wood.jpg',
        tableMaterial: 'https://storage.googleapis.com/pokerblow/story/spirit-world/old-paper-material.jpg',
      }
    case 'hell':
      return {
        background: 'https://storage.googleapis.com/pokerblow/story/hell/hell-background.jpg',
        tableEdges: 'https://storage.googleapis.com/pokerblow/story/hell/table-edges.jpg',
        tableMaterial: 'https://storage.googleapis.com/pokerblow/story/hell/material.jpg'
      }

    default:
      return {
        tableEdges: 'https://storage.googleapis.com/pokerblow/poker-table/black-wood.jpg'
      }
  }
}

// https://stackoverflow.com/a/9705160/10160865
export function toRadians(angle) {
  return angle * (Math.PI / 180);
}