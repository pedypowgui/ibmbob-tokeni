import type { PersonaId } from '../../models'
import { DashboardService } from '../../services/dashboardService'
import { BudgetService } from '../../services/budgetService'
import { GoalService } from '../../services/goalService'

export interface FinancialContext {
  personaId: PersonaId
  personaName: string
  income: number
  balance: number
  totalExpenses: number
  overBudgetCategories: string[]
  recentExpenses: Array<{ description: string; amount: number; category: string }>
  goals: Array<{ title: string; progress: number; targetAmount: number }>
}

export function buildContext(personaId: PersonaId): FinancialContext {
  const summary = DashboardService.getSummary(personaId)
  const budget = BudgetService.getBudget(personaId)
  const goals = GoalService.list(personaId)
  const personaName = personaId === 'jose' ? 'José Fá' : 'Janaína Brito'

  const overBudgetCategories = budget.categories
    .filter(c => c.isOverLimit)
    .map(c => c.label)

  const recentExpenses = summary.recentTransactions
    .filter(t => t.amount < 0)
    .slice(0, 5)
    .map(t => ({
      description: t.description,
      amount: Math.abs(t.amount),
      category: t.category,
    }))

  return {
    personaId,
    personaName,
    income: summary.income,
    balance: summary.balance,
    totalExpenses: summary.totalExpenses,
    overBudgetCategories,
    recentExpenses,
    goals: goals.map(g => ({
      title: g.title,
      progress: g.progress,
      targetAmount: g.targetAmount,
    })),
  }
}
