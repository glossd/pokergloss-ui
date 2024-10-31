export function getPortraitUserPlateRotateAngle(tableLen, position) {
  if (tableLen === 6) {
    switch (position) {
      case 0: return 45
      case 1: return 90
      case 2: return 135
      case 3: return 225
      case 4: return 270
      case 5: return 315
    }
  }
}

export function getPortraitPotDistance(tableLen, position) {
  if (tableLen === 6) {
    switch (position) {
      case 0: return 20
      case 1: return 60
      case 2: return 20
      case 3: return 20
      case 4: return 50
      case 5: return 20
    }
  }
}
