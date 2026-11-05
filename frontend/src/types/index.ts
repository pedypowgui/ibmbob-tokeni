// Shared API contract types — keep in sync with backend/src/models/

export type PersonaId = 'janaina' | 'jose'

export interface User {
  id: PersonaId
  name: string
  avatar: string
  monthlyIncome: number
  occupation: string
}

export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'housing'
  | 'salary'
  | 'other'

export type TransactionSource = 'manual' | 'imported' | 'simulated'

export interface Transaction {
  id: string
  personaId: PersonaId
  date: string
  description: string
  amount: number
  category: TransactionCategory
  source: TransactionSource
}

export interface BudgetCategory {
  category: TransactionCategory
  label: string
  limit: number
  used: number
  remaining: number
  percentUsed: number
  isOverLimit: boolean
}

export interface Budget {
  personaId: PersonaId
  month: string
  income: number
  totalSpent: number
  balance: number
  categories: BudgetCategory[]
}

export interface DashboardSummary {
  personaId: PersonaId
  month: string
  income: number
  totalExpenses: number
  balance: number
  alerts: Alert[]
  recentTransactions: Transaction[]
}

export interface Alert {
  id: string
  type: 'over_budget' | 'goal_near' | 'mission_available'
  message: string
  category?: TransactionCategory
}

export interface FinancialGoal {
  id: string
  personaId: PersonaId
  title: string
  emoji: string
  targetAmount: number
  currentAmount: number
  deadline: string
  progress: number
}

export interface Mission {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
  icon: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
}

export interface GamificationProfile {
  personaId: PersonaId
  points: number
  level: number
  levelLabel: string
  nextLevelPoints: number
  missions: Mission[]
  achievements: Achievement[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ApiResponse<T> {
  data: T | null
  error: { code: string; message: string } | null
}

// ─── Jornadas / Sistema de Sonhos ─────────────────────────────────────────────

export type JourneyStatus = 'draft' | 'pending_approval' | 'active' | 'paused' | 'completed' | 'cancelled'
export type LevelStatus = 'locked' | 'available' | 'in_progress' | 'completed'
export type MissionType = 'main' | 'secondary' | 'weekly_challenge' | 'awareness'
export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'pending_validation' | 'completed' | 'skipped'
export type CompletionType = 'automatic' | 'manual' | 'educational' | 'financial'

export interface CompletionCriteria {
  type: string
  description: string
  targetValue?: number
  currentValue?: number
}

export interface JourneyMission {
  id: string
  journeyId: string
  levelId: string
  title: string
  description: string
  type: MissionType
  completionType: CompletionType
  completionCriteria: CompletionCriteria
  rewardXp: number
  status: MissionStatus
  isRepeatable: boolean
  weekKey?: string
  completedAt: string | null
}

export interface JourneyLevel {
  id: string
  journeyId: string
  title: string
  description: string
  order: number
  objective: string
  status: LevelStatus
  completedAt: string | null
}

export interface Journey {
  id: string
  profileId: PersonaId
  title: string
  description: string
  targetAmount: number
  accumulatedAmount: number
  currentLevelId: string | null
  status: JourneyStatus
  journeyProgress: number
  financialProgress: number
  version: number
  createdAt: string
  approvedAt: string | null
  updatedAt: string
  goalId?: string
  emoji?: string
}

export interface JourneyDetail extends Journey {
  levels: JourneyLevel[]
  missions: JourneyMission[]
}

export interface UserProgress {
  profileId: PersonaId
  totalXp: number
  completedMissions: string[]
  unlockedAchievements: string[]
}

export interface XPHistory {
  id: string
  profileId: PersonaId
  missionId: string
  sourceId: string
  amount: number
  reason: string
  createdAt: string
}

export interface JourneyState {
  journey: JourneyDetail | null
  progress: UserProgress
}

export interface AllJourneysState {
  journeys: JourneyDetail[]
  progress: UserProgress
}
