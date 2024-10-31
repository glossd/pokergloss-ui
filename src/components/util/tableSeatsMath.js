
export let width = 50
export let aspectRatio = 7 / 4
export let height = computeHeight()
export let isMobile = false

function computeHeight() {
  return width / aspectRatio
}

export function setToMobileSizes(pageType) {
  if (pageType === 'sitngo') {
    width = 50
  } else {
    width = 60
  }
  height = computeHeight()
  isMobile = true
}

export function setToDesktopSizes() {
  width = 50;
  height = computeHeight()
  isMobile = false
}

export function getUserPlateRotateAngle(tableLen, position) {
  const isEven = tableLen % 2 === 0;
  const degDivider = isEven ? tableLen : tableLen + 1;
  const degsPerSeat = 360 / degDivider
  let angle = 270
  if (isEven) {
    angle += degsPerSeat * position + degsPerSeat / 2
  } else {
    angle += degsPerSeat * (position + 1)
  }

  if (angle < 0) {
    angle += 360
  }
  if (angle > 360) {
    angle -= 360
  }

  const saa = symmetricAcuteAngle(angle);
  if (saa.angle !== 90) {
    const takeAwayScalar = (90 -saa.angle) /20
    const takeAway = (saa.angle/9) * takeAwayScalar
    if (saa.isReverse) {
      angle += takeAway
    } else {
      angle -= takeAway
    }
  }

  return angle
}

// In vw
export function getUserPlateDistance(rotateAngle, minUserPlateDistanceFromTableCenter = height * 22 / 40) {
  const minDistance = minUserPlateDistanceFromTableCenter
  const maxDistanceToAdd = minDistance * (aspectRatio - 1) - 2
  let angle = acuteAngle(rotateAngle)
  let distanceToAdd = maxDistanceToAdd * Math.pow(angle / 90, 55 / angle);
  if (distanceToAdd === 0) {
    distanceToAdd = -0.9 // little correction for the centered player
  }
  if (distanceToAdd === maxDistanceToAdd) {
    distanceToAdd = maxDistanceToAdd - 0.5 // little correction for the side players
  }
  return minDistance + distanceToAdd
}

export function getBetDistance() {
  return 6
}

export function getPotDistance(rotateAngle) {
  return getUserPlateDistance(rotateAngle) - (isMobile ? 7 : 5)
}

export function toCoordinates(angle, distance) {
  const x = distance * Math.cos(toRadians(angle))
  const y = distance * Math.sin(toRadians(angle))
  return {x, y}
}

// https://stackoverflow.com/a/9705160/10160865
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function getBlindDistanceV2(rotateAngle) {
  return getUserPlateDistance(rotateAngle) - (isMobile ? 6 : 4)
}

export function getBetRotateAngle(tableLen, position) {
  const angle = getUserPlateRotateAngle(tableLen, position)
  return angle + 180
}

export function getBetRotateAngleAdjusted(tableLen, position) {
  const angle = getUserPlateRotateAngle(tableLen, position)
  const saaObj = symmetricAcuteAngle(angle)
  let dif = 0
  const saa = saaObj.angle
  if (saa < 90 && saa > 40) {
    dif = (90-saa) / 2
  }

  if (saaObj.isReverse) {
    dif = -dif
  }

  return angle + 180 + dif
}

// 20 -> 20
// 160 -> 20
// 250 -> 20
// 290 -> 20
function symmetricAcuteAngle(angle) {
  const periodAngle = angle % 180
  if (periodAngle <= 90) {
    return {angle: periodAngle, isReverse: false}
  } else {
    return {angle: 180 - periodAngle, isReverse: true}
  }
}

// from 0 to 90
export function acuteAngle(rotateAngle) {
  const periodAngle = rotateAngle % 180
  if (periodAngle < 90) {
    return 90 - periodAngle;
  } else {
    return periodAngle - 90
  }
}
