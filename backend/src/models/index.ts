// ─── User / Persona ───────────────────────────────────────────────────────────

export type PersonaId = 'janaina' | 'jose'

export interface User {
  id: PersonaId
  name: string
  avatar: string
  monthlyIncome: number
  occupation: string
}

// ─── Transactions ─────────────────────────────────────────────────────────────

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

// ─── Budget ───────────────────────────────────────────────────────────────────

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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export type AlertType = 'over_budget' | 'goal_near' | 'mission_available'

export interface Alert {
  id: string
  type: AlertType
  message: string
  category?: TransactionCategory
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

// ─── Goals ────────────────────────────────────────────────────────────────────

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

// ─── Gamification ─────────────────────────────────────────────────────────────

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

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: { code: string; message: string } | null
}

export function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null }
}

export function fail(code: string, message: string): ApiResponse<never> {
  return { data: null, error: { code, message } }
}
