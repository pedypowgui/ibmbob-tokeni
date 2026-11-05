import * as fs from 'fs'
import * as path from 'path'
import type {
  PersonaId, User, Transaction, FinancialGoal, GamificationProfile,
} from '../models'

interface PersonaData {
  user: User
  transactions: Transaction[]
  budgetLimits: Record<string, number>
  goals: FinancialGoal[]
  gamification: GamificationProfile
}

const cache = new Map<PersonaId, PersonaData>()

function load(personaId: PersonaId): PersonaData {
  if (cache.has(personaId)) return cache.get(personaId)!
  const file = path.join(__dirname, `../data/${personaId}.json`)
  const raw = fs.readFileSync(file, 'utf-8')
  const data = JSON.parse(raw) as PersonaData
  cache.set(personaId, data)
  return data
}

export const UserRepository = {
  findAll(): User[] {
    return (['jose'] as PersonaId[]).map(id => load(id).user)
  },
  findById(id: PersonaId): User | null {
    try { return load(id).user } catch { return null }
  },
}

export const TransactionRepository = {
  findByPersona(personaId: PersonaId): Transaction[] {
    return load(personaId).transactions
  },
  findById(personaId: PersonaId, id: string): Transaction | null {
    return load(personaId).transactions.find(t => t.id === id) ?? null
  },
}

export const BudgetLimitRepository = {
  findByPersona(personaId: PersonaId): Record<string, number> {
    return load(personaId).budgetLimits
  },
}

export const GoalRepository = {
  findByPersona(personaId: PersonaId): FinancialGoal[] {
    // Return a copy so mutations are isolated
    return [...load(personaId).goals]
  },
  findById(personaId: PersonaId, id: string): FinancialGoal | null {
    return load(personaId).goals.find(g => g.id === id) ?? null
  },
  save(personaId: PersonaId, goal: FinancialGoal): FinancialGoal {
    const data = load(personaId)
    const idx = data.goals.findIndex(g => g.id === goal.id)
    if (idx >= 0) {
      data.goals[idx] = goal
    } else {
      data.goals.push(goal)
    }
    return goal
  },
}

export const GamificationRepository = {
  findByPersona(personaId: PersonaId): GamificationProfile {
    return load(personaId).gamification
  },
  completeMission(personaId: PersonaId, missionId: string): boolean {
    const profile = load(personaId).gamification
    const mission = profile.missions.find(m => m.id === missionId)
    if (!mission || mission.completed) return false
    mission.completed = true
    profile.points += mission.points
    return true
  },
}
