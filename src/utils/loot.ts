import type { Artifact, Rarity } from '../types'

type LootRollResult = {
  rarity: Rarity
  artifact: Artifact
}

function rollRarity(): Rarity {
  const random = Math.random() * 100

  if (random < 60) return 'common'
  if (random < 90) return 'rare'
  return 'epic'
}

export function rollLootbox(allArtifacts: Artifact[]): LootRollResult | null {
  const rarity = rollRarity()

  const filtered = allArtifacts.filter((artifact) => artifact.rarity === rarity)

  if (filtered.length === 0) return null

  const randomIndex = Math.floor(Math.random() * filtered.length)
  const artifact = filtered[randomIndex]

  return {
    rarity,
    artifact,
  }
}