import React from 'react';
import i18nEn from './i18n-en'
import { render } from '@testing-library/react';
import HandName from "./HandName";
import {I18nextProvider} from "next-i18next";

function assertHandName(text, cards) {
  const c = render(
    provider(cards)
  );
  expect(c.getByText(text)).toBeDefined()
}

function provider(cards) {
  return (
    <I18nextProvider i18n={i18nEn}>
      <HandName cards={cards}/>
    </I18nextProvider>
  )
}

it('en', () => {
  assertHandName("High A", ['4s', 'Ks', 'Jc', 'As', '2h'])
  assertHandName("High 10", ['4s', '3s', 'Tc', '6s', '8h'])
  assertHandName("Pair, 10", ['4s', 'Ks', 'Tc', 'Ts', '2h'])
  assertHandName("Two Pair, K & 4", ['4s', 'Ks', 'Kc', 'Ts', '4h'])
  assertHandName("Set, K", ['4s', 'Ks', 'Kc', 'Ts', 'Kh'])
  assertHandName("Straight, 6 High", ['2s', '3s', '4c', '5h', '6d'])
  assertHandName("Straight, 10 High", ['6s', '7s', '8c', '9h', 'Td'])
  assertHandName("Flush, Qs High", ['2s', '3s', '4s', 'Qs', '6s'])
  assertHandName("Flush, 10s High", ['6s', '7s', '2s', '9s', 'Ts'])
  assertHandName("Full House, A over 10", ['As', 'Ad', 'Ah', 'Td', 'Ts'])
  assertHandName("Quads, 10", ['Ts', 'Ks', 'Tc', 'Th', 'Td'])
  assertHandName("Quads, Q", ['Qs', 'Ks', 'Qc', 'Qh', 'Qd'])
  assertHandName("Straight Flush, 6s High", ["2s", "3s", "4s", "5s", "6s"])
  assertHandName("Straight Flush, 10s High", ["6s", "7s", "8s", "9s", "Ts"])
  assertHandName("Straight Flush Royal", ["Ts", "Js", "Qs", "Ks", "As"])
})
