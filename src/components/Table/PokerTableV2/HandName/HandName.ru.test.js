import React from 'react';
import i18nRu from './i18n-ru'
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
    <I18nextProvider i18n={i18nRu}>
      <HandName cards={cards}/>
    </I18nextProvider>
  )
}

it('ru', () => {
  assertHandName("Старшая A", ['4s', 'Ks', 'Jc', 'As', '2h'])
  assertHandName("Старшая 10", ['4s', '3s', 'Tc', '6s', '8h'])
  assertHandName("Пара, 10", ['4s', 'Ks', 'Tc', 'Ts', '2h'])
  assertHandName("Две пары, K & 4", ['4s', 'Ks', 'Kc', 'Ts', '4h'])
  assertHandName("Сет, K", ['4s', 'Ks', 'Kc', 'Ts', 'Kh'])
  assertHandName("Стрит, 6 Старшая", ['2s', '3s', '4c', '5h', '6d'])
  assertHandName("Стрит, 10 Старшая", ['6s', '7s', '8c', '9h', 'Td'])
  assertHandName("Флеш, Qs Старшая", ['2s', '3s', '4s', 'Qs', '6s'])
  assertHandName("Флеш, 10s Старшая", ['6s', '7s', '2s', '9s', 'Ts'])
  assertHandName("Фул Хаус, A over 10", ['As', 'Ad', 'Ah', 'Td', 'Ts'])
  assertHandName("Каре, 10", ['Ts', 'Ks', 'Tc', 'Th', 'Td'])
  assertHandName("Каре, Q", ['Qs', 'Ks', 'Qc', 'Qh', 'Qd'])
  assertHandName("Стрит Флеш, 6s Старшая", ["2s", "3s", "4s", "5s", "6s"])
  assertHandName("Стрит Флеш, 10s Старшая", ["6s", "7s", "8s", "9s", "Ts"])
  assertHandName("Стрит Флеш Рояль", ["Ts", "Js", "Qs", "Ks", "As"])
})