export function getLevelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1
}

export function getXpProgress(xp: number) {
  return xp % 100
}