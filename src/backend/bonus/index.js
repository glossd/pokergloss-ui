import {DefaultApi} from "@pokergloss/bonus-client-typescript";
import {getBasePath} from "../index";

const api = new DefaultApi(undefined, getBasePath("bonus"));

export async function takeDailyBonus() {
/*  return Promise.resolve({
    isBonusPresent: true,
    bonus: {
      chips: 1500,
      dayInARow: 4
    }
  })*/
  const r = await api.takeDailyBonus()
  return r.data
}
