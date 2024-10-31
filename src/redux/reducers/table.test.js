import React from "react";
import {mergeTable} from "./table";

it('merge table', () => {
  const oldTable = {
    id: "5f61e3981290bea452c1929a",
    status: "waiting",
    seats: [
      {
        position: 0,
        player: {
          status: "playing"
        }
      },
      {
        position: 1,
        player: {
          status: "sittingOut"
        }
      }
    ],
  }
  const newTable = {
    id: "5f61e3981290bea452c1929a",
    status: "playing",
    seats: [
      {
        position: 1,
        player: {
          status: "playing"
        }
      }
    ],
  }
  let merged = mergeTable(oldTable, newTable)

  expect(merged.seats.length).toBe(2)
  expect(merged.status).toBe("playing")
  expect(merged.seats[0].player.status).toBe("playing")
  expect(merged.seats[1].player.status).toBe("playing")
});

it('merge table with no seats', () => {
  const oldTable = {
    id: "5f61e3981290bea452c1929a",
    status: "playing",
    seats: [
      {
        position: 0,
        player: {
          status: "playing"
        }
      },
      {
        position: 1,
        player: {
          status: "playing"
        }
      }
    ],
  };

  const cards = ["6c", "Kc", "6h"];
  const newTable = {
    communityCards: cards
  };

  let merged = mergeTable(oldTable, newTable);

  expect(merged.communityCards).toBe(cards)
});

it('merge player', () => {
  const oldTable = {
    id: "5f61e3981290bea452c1929a",
    status: "playing",
    seats: [
      {
        position: 0,
        player: {
          stack: 250,
          status: "playing"
        }
      },
      {
        position: 1,
        player: {
          stack: 250,
          status: "playing"
        }
      }
    ],
  };

  const newTable = {
    seats: [
      {
        position: 0,
        player: {
          stack: 200,
        }
      },
      {
        position: 1,
        player: {
          stack: 300,
        }
      }
    ]
  };

  let merged = mergeTable(oldTable, newTable);

  expect(merged.status).toBe("playing")
  expect(merged.seats[0].player.stack).toBe(200)
  expect(merged.seats[0].player.status).toBe("playing")
  expect(merged.seats[1].player.stack).toBe(300)
  expect(merged.seats[1].player.status).toBe("playing")
});

it('merge seat', () => {
  const oldTable = {
    id: "5f61e3981290bea452c1929a",
    status: "playing",
    seats: [
      {
        position: 0,
        blind: "smallBlindDealer",
        player: {
          status: "playing"
        }
      },
      {
        position: 1,
        blind: "bigBlind",
        player: {
          status: "playing"
        }
      }
    ],
  };

  const newTable = {
    seats: [
      {
        position: 0,
        blind: "bigBlind"
      },
      {
        position: 1,
        blind: "smallBlindDealer"
      }
    ]
  };

  let merged = mergeTable(oldTable, newTable);

  expect(merged.seats[0].blind).toBe("bigBlind")
  expect(merged.seats[1].blind).toBe("smallBlindDealer")
});
