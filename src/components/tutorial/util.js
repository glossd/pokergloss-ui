
export function rootStyle(isExtendedHeight) {
  return { height: isExtendedHeight ? "120vh" : "100%" }
}

export const combinationIds = Object.freeze({
  StraightFlush: "Straight Flush",
  FourOfAKind: "Four of a Kind",
  FullHouse: "Full House",
  Flush: "Flush",
  Straight: "Straight",
  ThreeOfAKind: "Three of a Kind",
  TwoPair: "Two Pair",
  Pair: "Pair",
  HighCard: "High Card"
});