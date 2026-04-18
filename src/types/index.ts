export type Rarity = 'common' | 'rare' | 'epic'
export type Lang = 'kg' | 'ru' | 'en'
export type LocationKind = 'sacred' | 'petroglyph'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface PetroSubmission {
  id: number
  imageUrl: string
  title: string
  aiSummary: string
  suggestedType: 'animal' | 'hunter' | 'symbol' | 'unknown'
  status: SubmissionStatus
  createdAt: string
  lat: number
  lng: number
}
export interface Artifact {
  id: number
  name: string
  description: string
  rarity: Rarity
  points: number
  income: number
  image?: string
}

export interface SacredRule {
  id: string
  text: string
}

export interface HeritageLocation {
  id: number
  name: string
  shortName?: string
  kind: LocationKind
  description: string
  culturalNote?: string
  district?: string
  lat: number
  lng: number
  radiusMeters: number
  rewardArtifactId?: number
  rules?: SacredRule[]
  sourceLabel?: string
  isUserGenerated?: boolean
  analysisSummary?: string
}

export interface UserState {
  points: number
  level: number
  xp: number
  collection: Artifact[]
  achievements: string[]
}
export type ArtworkCategory = 'goat' | 'deer' | 'hunter' | 'sun' | 'abstract'

export interface WorkshopArtwork {
  id: number
  title: string
  author: string
  imageUrl: string
  category: ArtworkCategory
  description: string
  votes: number
  rating: number
  voters: number
  createdAt: string
  isPublished: boolean
}