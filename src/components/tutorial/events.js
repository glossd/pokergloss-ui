import {ModelPlayerBlindEnum} from "@pokergloss/table-client-typescript";

export const userOnTable = () => ({
  seats:[
    user()
  ]
})

export const user = (stack=100) => ({
  "blind":"",
  "position":1,
  "player": {
    "blind":"",
    "intent":null,
    "lastGameAction":"",
    "lastGameBet":0,
    "cards": [],
    "position":1,
    "stack":stack,
    "status":"ready",
    "totalRoundBet":0,
    "userId":"position_1",
    "username":"You"
  }
})

export const getInitTable = () => ({
    "id": "tutorial",
    "name": "Tutorial",
    "size": 6,
    "bigBlind": 2,
    "smallBlind": 1,
    "decisionTimeoutSec": 10,
    "bettingLimit": "NL",
    "minBuyIn": 100,
    "maxBuyIn": 400,
    "type": "cashGame",
    "occupied": 1,
    "avgStake": 0,
    "avgPot": 0,
    "seats": [
      bot(0),
      {"position": 1, "blind": "", "player": null},
      bot(2),
      bot(3),
      bot(4),
      bot(5)
    ],
    "status": "waiting",
    "maxRoundBet": 0,
    "bettingLimitChips": 9223372036854775807,
    "pots": null,
    "totalPot": 0,
    "communityCards": [],
    "decidingPosition": -1,
    "lastAggressorPosition": -1,
    "themeId": "",
    "isSurvival": false,
    "survivalLevel": 0
})

export const bot = (pos, stack=100, blind="", ) => ({
    position: pos,
    blind: blind,
    player: {
      userId:"position_" + pos,
      username: botUsername(pos),
      picture:"https://storage.googleapis.com/pokerblow/lobby/default-avatar.jpg",
      position:pos,
      stack:stack,
      status:"ready",
      blind:blind,
      totalRoundBet:0,
      lastGameBet:0,
      lastGameAction:"",
      intent:null,
      bankRank:0,
      marketItemId:"invisible",
      marketItemCoins:0
    }
  }
)

function botUsername(pos) {
  switch (pos) {
    case 0: return "Diamond"
    case 2: return "danny"
    case 3: return "Artie"
    case 4: return "IVORY"
    case 5: return "KENNY"
  }
}

export const emptySeat = (pos) => ({
    position: pos,
    blind: "",
    player: null
  }
)

export const holeCards = (cards, positions=[0,2,3,4,5]) => {
  let seats = []
  positions.sort()
  if (positions.includes(0)) {
    seats.push(holeCardsSeat(0))
  }
  seats.push({
    "blind": "",
    "position": 1,
    "player": {
      "position": 1,
      "blind": "",
      "cards": cards,
      "status": "playing",
    }
  })

  seats.push(...positions.filter(p => p !== 0).map(p => holeCardsSeat(p)))

  return {seats}
}

function holeCardsSeat(pos) {
  return {
    "blind": "",
    "position": pos,
    "player": {
      "position": pos,
      "blind": "",
      "cards": ["Xx", "Xx"],
      "status": "playing",
    },
  };
}

export const blinds = (dealer=4, bbChips = 98, sbChips=99, outPositions=[]) => {
  outPositions.sort()
  function nextPos(pos) {
    const phantomNext = pos === 5 ? 0 : pos + 1
    if (outPositions.includes(phantomNext)) {
      return nextPos(phantomNext)
    } else {
      return phantomNext
    }
  }
  const smallBlind = nextPos(dealer)
  const bigBlind = nextPos(smallBlind)
  return {
    "bettingLimitChips": 9223372036854776000,
    "maxRoundBet": 2,
    "status": "playing",
    "totalPot": 3,
    "seats": [
      {
        "blind": ModelPlayerBlindEnum.BigBlind,
        "position": bigBlind,
        "player": {
          "position": bigBlind,
          "blind": ModelPlayerBlindEnum.BigBlind,
          "lastGameBet": 2,
          "stack": bbChips,
          "status": "playing",
          "totalRoundBet": 2,
        },
      },
      {
        "blind": ModelPlayerBlindEnum.SmallBlind,
        "position": smallBlind,
        "player": {
          "position": smallBlind,
          "blind": ModelPlayerBlindEnum.SmallBlind,
          "lastGameBet": 1,
          "stack": sbChips,
          "status": "playing",
          "totalRoundBet": 1,
        },
      },
      {
        "blind": ModelPlayerBlindEnum.Dealer,
        "position": dealer,
        "player": {
          "position": dealer,
          "blind": ModelPlayerBlindEnum.Dealer,
          "status": "playing",
        },
      },
    ],
  }
}

export const timeToDecide = (pos) => ({
  "decidingPosition":pos,
  "lastAggressorPosition":-1,
  "seats":[
    {
      "position":pos,
      "player":{"intent":null,"isDeciding":true,"position":pos,"timeoutAt":Date.now()+180*1000}
    }
  ]
})

export const playerAction = (pos, pot, type = "call", chips = 0, stack = 98, maxRoundBet) => ({
  "decidingPosition": -1,
  "maxRoundBet": (maxRoundBet === undefined ? chips : maxRoundBet),
  "seats": [
    {
      "player": {
        "isDeciding": false,
        "lastGameAction": type,
        "lastGameBet": chips,
        "position": pos,
        "stack": stack,
        "status": "playing",
        "totalRoundBet": chips,
      },
      "position": pos
    }
  ],
  "totalPot": pot
})

export const newBettingRound = (cards, newCards, pot, positions) => ({
  "newCards": newCards,
  "roundType": "flop",
  "table": {
    "communityCards": cards,
    "pots": [{"chips": pot, "winnerPositions": null}],
    "seats": newBettingRoundSeats(positions),
    "maxRoundBet":0,
    "totalPot": pot
  }
})

export const newBettingRoundSeats = (positions=[0,1,2,3,4,5]) => {
  let seats = []
  for (let i = 0; i < 6; i++) {
    if (positions.includes(i)) {
      seats.push(newBettingRoundSeat(i))
    }
  }
  return seats
}

export const newBettingRoundSeat = (pos) => ({
  "position": pos,
  "player": {
    "intent": null,
    "position": pos,
    "totalRoundBet": 0
  }
})

export const showCards = (pos, cards) => ({
  "decidingPosition": -1,
  "status": "showDown",
  "seats": [
    {
      "player": {
        "cards": cards,
        "position": pos,
        "isDeciding": false,
        "showDownAction": "show",
        "status": "playing",
      },
      "position": pos
    }
  ]
})

export const muck = (pos) => ({
  "decidingPosition": -1,
  "seats": [
    {
      "player": {
        "position": pos,
        "isDeciding": false,
        "showDownAction": "muck",
        "status": "playing",
      },
      "position": pos
    }
  ]
})

export const winners = (pot, wonPos, cards, positions) => ({
  "newCards": [],
  "table": {
    "communityCards": cards,
    "decidingPosition": -1,
    "pots": [
      {
        "chips": pot,
        "winnerPositions": [wonPos]
      }
    ],
    "seats": winnerSeatsReset(positions),
    "status": "gameEnd",
    "totalPot": pot,
    "winners": [
      {
        "chips": pot,
        "position": wonPos,
      }
    ]
  }
})

export function winnerSeatsReset(positions=[0,1,2,3,4,5]) {
  function seat(pos) {
    return {
      "player": {
        "intent": null,
        "position": pos,
        "totalRoundBet": 0
      },
      "position": pos
    }
  }

  return positions.map(p => seat(p))
}

export const emoji = (pos, emoji) => ({
  "emoji": emoji,
  "user": {
    "userId": "position_" + pos,
  }
})