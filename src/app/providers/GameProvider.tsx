import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Artifact,
  UserState,
  PetroSubmission,
  HeritageLocation,
  WorkshopArtwork,
} from '../../types'
import { getLevelFromXp } from '../../utils/level'
import { getLocations } from '../../data/locations'
import { useLang } from './LanguageProvider'

interface GameContextType extends UserState {
  addArtifact: (artifact: Artifact) => { added: boolean; duplicate: boolean }
  addPoints: (amount: number) => void
  addAchievement: (achievement: string) => void
  hasArtifact: (artifactId: number) => boolean

  mapLocations: HeritageLocation[]
  submissions: PetroSubmission[]

  addSubmission: (submission: PetroSubmission) => void
  approveSubmission: (submissionId: number) => void
  rejectSubmission: (submissionId: number) => void

  artworks: WorkshopArtwork[]
  publishArtwork: (artwork: Omit<WorkshopArtwork, 'id' | 'votes' | 'rating' | 'voters' | 'createdAt' | 'isPublished'>) => void
  voteArtwork: (artworkId: number, ratingValue: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const initialState: UserState = {
  points: 0,
  level: 1,
  xp: 0,
  collection: [],
  achievements: [],
}

function getInitialArtworks(lang: 'ru' | 'en'): WorkshopArtwork[] {
  return [
    {
      id: 1001,
      title: 'Arhar of the Ridge',
      author: 'Aizada',
      imageUrl: '/demo-artworks/arhar-demo.jpg',
      category: 'goat',
      description: lang === 'en'
        ? 'Mountain arhar on a rocky slope.'
        : 'Горный архар на каменном склоне.',
      votes: 42,
      rating: 4.8,
      voters: 11,
      createdAt: new Date().toISOString(),
      isPublished: true,
    },
    {
      id: 1002,
      title: 'Sun Memory',
      author: 'Bek',
      imageUrl: '/demo-artworks/sun-demo.jpg',
      category: 'sun',
      description: lang === 'en'
        ? 'Solar sign in the style of ancient notches.'
        : 'Солнечный знак в стиле древней насечки.',
      votes: 31,
      rating: 4.6,
      voters: 9,
      createdAt: new Date().toISOString(),
      isPublished: true,
    },
  ]
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang()
  const [state, setState] = useState<UserState>(initialState)
  const [mapLocations, setMapLocations] = useState<HeritageLocation[]>(() => getLocations(lang))
  const [submissions, setSubmissions] = useState<PetroSubmission[]>([])
  const [artworks, setArtworks] = useState<WorkshopArtwork[]>(() => getInitialArtworks(lang))

  // When language changes, regenerate seed data (locations & demo artworks)
  // so their textual content stays in sync with the active language.
  // User submissions and published artworks are preserved as-is.
  useEffect(() => {
    setMapLocations(getLocations(lang))
    setArtworks((prev) => {
      // Preserve user-published artworks (id !== 1001 && id !== 1002)
      const userArtworks = prev.filter((a) => a.id !== 1001 && a.id !== 1002)
      return [...getInitialArtworks(lang), ...userArtworks]
    })
  }, [lang])

  const addPoints = (amount: number) => {
    setState((prev) => {
      const nextXp = prev.xp + amount
      return {
        ...prev,
        points: prev.points + amount,
        xp: nextXp,
        level: getLevelFromXp(nextXp),
      }
    })
  }

  const addAchievement = (achievement: string) => {
    setState((prev) => {
      if (prev.achievements.includes(achievement)) return prev
      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
      }
    })
  }

  const addArtifact = (artifact: Artifact) => {
    const alreadyExists = state.collection.some((item) => item.id === artifact.id)

    if (alreadyExists) {
      const duplicateReward = Math.floor(artifact.points * 0.4)
      addPoints(duplicateReward)
      return {
        added: false,
        duplicate: true,
      }
    }

    setState((prev) => {
      const nextXp = prev.xp + artifact.points
      const nextCollection = [...prev.collection, artifact]
      const nextAchievements = [...prev.achievements]

      if (nextCollection.length === 1 && !nextAchievements.includes('First Artifact')) {
        nextAchievements.push('First Artifact')
      }

      if (nextCollection.length >= 3 && !nextAchievements.includes('Museum Starter')) {
        nextAchievements.push('Museum Starter')
      }

      if (
        nextCollection.some((item) => item.rarity === 'epic') &&
        !nextAchievements.includes('Epic Discovery')
      ) {
        nextAchievements.push('Epic Discovery')
      }

      return {
        ...prev,
        collection: nextCollection,
        points: prev.points + artifact.points,
        xp: nextXp,
        level: getLevelFromXp(nextXp),
        achievements: nextAchievements,
      }
    })

    return {
      added: true,
      duplicate: false,
    }
  }

  const hasArtifact = (artifactId: number) => {
    return state.collection.some((item) => item.id === artifactId)
  }

  const addSubmission = (submission: PetroSubmission) => {
    setSubmissions((prev) => [submission, ...prev])
  }

  const approveSubmission = (submissionId: number) => {
    const target = submissions.find((item) => item.id === submissionId)
    if (!target) return

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId ? { ...item, status: 'approved' } : item
      )
    )

    const newLocation: HeritageLocation = {
      id: Date.now(),
      name: target.title,
      kind: 'petroglyph',
      description: lang === 'en'
        ? 'User-submitted find confirmed by an administrator.'
        : 'Пользовательская находка, подтвержденная администратором.',
      culturalNote: lang === 'en'
        ? 'Point appeared on the map after moderation review.'
        : 'Точка появилась на карте после moderation review.',
      lat: target.lat,
      lng: target.lng,
      radiusMeters: 120,
      isUserGenerated: true,
      sourceLabel: lang === 'en' ? 'Approved community submission' : 'Одобренная заявка сообщества',
      analysisSummary: target.aiSummary,
    }

    setMapLocations((prev) => [newLocation, ...prev])
  }

  const rejectSubmission = (submissionId: number) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId ? { ...item, status: 'rejected' } : item
      )
    )
  }

  const publishArtwork: GameContextType['publishArtwork'] = (artwork) => {
    const newArtwork: WorkshopArtwork = {
      id: Date.now(),
      title: artwork.title,
      author: artwork.author,
      imageUrl: artwork.imageUrl,
      category: artwork.category,
      description: artwork.description,
      votes: 0,
      rating: 0,
      voters: 0,
      createdAt: new Date().toISOString(),
      isPublished: true,
    }

    setArtworks((prev) => [newArtwork, ...prev])

    addPoints(20)
    addAchievement('First Published Artwork')
  }

  const voteArtwork = (artworkId: number, ratingValue: number) => {
    setArtworks((prev) =>
      prev.map((item) => {
        if (item.id !== artworkId) return item

        const nextVotes = item.votes + 1
        const nextVoters = item.voters + 1
        const nextRating =
          (item.rating * item.voters + ratingValue) / nextVoters

        return {
          ...item,
          votes: nextVotes,
          voters: nextVoters,
          rating: Number(nextRating.toFixed(2)),
        }
      })
    )
  }

  const value = useMemo(
    () => ({
      ...state,
      addArtifact,
      addPoints,
      addAchievement,
      hasArtifact,
      mapLocations,
      submissions,
      addSubmission,
      approveSubmission,
      rejectSubmission,
      artworks,
      publishArtwork,
      voteArtwork,
    }),
    [state, mapLocations, submissions, artworks]
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }

  return context
}