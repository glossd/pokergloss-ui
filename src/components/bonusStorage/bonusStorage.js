
const key = "bonusDay"

export function setBonusDay(day) {
  localStorage.setItem(key, day)
}

export function getBonusDay() {
  return localStorage.getItem(key)
}

export function deleteBonusDay() {
  localStorage.removeItem(key)
}