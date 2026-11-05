import type {
  PersonaId,
  Journey,
  JourneyLevel,
  JourneyMission,
  XPHistory,
  UserProgress,
  JourneyStatus,
  MissionStatus,
} from '../models'

// ─── In-memory stores (reset on process restart; acceptable for MVP) ──────────

const journeys = new Map<string, Journey>()
const levels = new Map<string, JourneyLevel>()
const missions = new Map<string, JourneyMission>()
const xpHistory: XPHistory[] = []
const userProgress = new Map<PersonaId, UserProgress>()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ensureProgress(profileId: PersonaId): UserProgress {
  if (!userProgress.has(profileId)) {
    userProgress.set(profileId, {
      profileId,
      totalXp: 0,
      completedMissions: [],
      unlockedAchievements: [],
    })
  }
  return userProgress.get(profileId)!
}

// ─── Journey ─────────────────────────────────────────────────────────────────

export const JourneyRepository = {
  findByPersona(profileId: PersonaId): Journey[] {
    return Array.from(journeys.values()).filter(j => j.profileId === profileId)
  },

  /** Retorna todas as jornadas não-canceladas/concluídas de uma persona */
  findAllActiveByPersona(profileId: PersonaId): Journey[] {
    return Array.from(journeys.values()).filter(
      j => j.profileId === profileId && j.status !== 'cancelled',
    )
  },

  /** @deprecated use findAllActiveByPersona — mantido para compatibilidade */
  findActiveByPersona(profileId: PersonaId): Journey | null {
    return (
      Array.from(journeys.values()).find(
        j => j.profileId === profileId && (j.status === 'active' || j.status === 'pending_approval'),
      ) ?? null
    )
  },

  /** Verifica se já existe jornada ativa/pendente vinculada a uma meta específica */
  findByGoalId(profileId: PersonaId, goalId: string): Journey | null {
    return (
      Array.from(journeys.values()).find(
        j => j.profileId === profileId && j.goalId === goalId && j.status !== 'cancelled',
      ) ?? null
    )
  },

  findById(id: string): Journey | null {
    return journeys.get(id) ?? null
  },

  save(journey: Journey): Journey {
    journeys.set(journey.id, journey)
    return journey
  },

  updateStatus(id: string, status: JourneyStatus): Journey | null {
    const journey = journeys.get(id)
    if (!journey) return null
    journey.status = status
    journey.updatedAt = new Date().toISOString()
    if (status === 'active') journey.approvedAt = new Date().toISOString()
    return journey
  },

  updateProgress(id: string, journeyProgress: number, financialProgress: number): Journey | null {
    const journey = journeys.get(id)
    if (!journey) return null
    journey.journeyProgress = journeyProgress
    journey.financialProgress = financialProgress
    journey.updatedAt = new Date().toISOString()
    return journey
  },

  updateAccumulated(id: string, amount: number): Journey | null {
    const journey = journeys.get(id)
    if (!journey) return null
    journey.accumulatedAmount = amount
    journey.financialProgress = journey.targetAmount > 0
      ? Math.min(100, (amount / journey.targetAmount) * 100)
      : 0
    journey.updatedAt = new Date().toISOString()
    return journey
  },
}

// ─── Levels ──────────────────────────────────────────────────────────────────

export const LevelRepository = {
  findByJourney(journeyId: string): JourneyLevel[] {
    return Array.from(levels.values())
      .filter(l => l.journeyId === journeyId)
      .sort((a, b) => a.order - b.order)
  },

  findById(id: string): JourneyLevel | null {
    return levels.get(id) ?? null
  },

  save(level: JourneyLevel): JourneyLevel {
    levels.set(level.id, level)
    return level
  },

  complete(id: string): JourneyLevel | null {
    const level = levels.get(id)
    if (!level) return null
    level.status = 'completed'
    level.completedAt = new Date().toISOString()
    return level
  },
}

// ─── Missions ────────────────────────────────────────────────────────────────

export const MissionRepository = {
  findByJourney(journeyId: string): JourneyMission[] {
    return Array.from(missions.values()).filter(m => m.journeyId === journeyId)
  },

  findByLevel(levelId: string): JourneyMission[] {
    return Array.from(missions.values()).filter(m => m.levelId === levelId)
  },

  findById(id: string): JourneyMission | null {
    return missions.get(id) ?? null
  },

  save(mission: JourneyMission): JourneyMission {
    missions.set(mission.id, mission)
    return mission
  },

  updateStatus(id: string, status: MissionStatus): JourneyMission | null {
    const mission = missions.get(id)
    if (!mission) return null
    mission.status = status
    if (status === 'completed') mission.completedAt = new Date().toISOString()
    return mission
  },
}

// ─── XP History ──────────────────────────────────────────────────────────────

export const XPHistoryRepository = {
  findByPersona(profileId: PersonaId): XPHistory[] {
    return xpHistory.filter(x => x.profileId === profileId)
  },

  alreadyRewarded(profileId: PersonaId, missionId: string, weekKey?: string): boolean {
    return xpHistory.some(
      x =>
        x.profileId === profileId &&
        x.missionId === missionId &&
        (weekKey ? x.sourceId === `${missionId}:${weekKey}` : true),
    )
  },

  add(entry: XPHistory): XPHistory {
    xpHistory.push(entry)
    return entry
  },
}

// ─── User Progress ────────────────────────────────────────────────────────────

export const UserProgressRepository = {
  find(profileId: PersonaId): UserProgress {
    return ensureProgress(profileId)
  },

  addXp(profileId: PersonaId, amount: number): UserProgress {
    const p = ensureProgress(profileId)
    p.totalXp += amount
    return p
  },

  markMissionComplete(profileId: PersonaId, missionId: string): UserProgress {
    const p = ensureProgress(profileId)
    if (!p.completedMissions.includes(missionId)) p.completedMissions.push(missionId)
    return p
  },
}
