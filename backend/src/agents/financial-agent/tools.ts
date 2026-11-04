import type { PersonaId } from '../../models'
import { DashboardService } from '../../services/dashboardService'
import { TransactionService } from '../../services/transactionService'
import { BudgetService } from '../../services/budgetService'
import { GoalService } from '../../services/goalService'

export interface ToolResult {
  toolName: string
  result: unknown
}

export const agentTools = {
  getFinancialSummary(personaId: PersonaId): ToolResult {
    const data = DashboardService.getSummary(personaId)
    return {
      toolName: 'getFinancialSummary',
      result: {
        income: data.income,
        totalExpenses: data.totalExpenses,
        balance: data.balance,
        alertCount: data.alerts.length,
      },
    }
  },

  getTransactions(personaId: PersonaId, category?: string): ToolResult {
    const data = TransactionService.list(personaId, category ? { category } : undefined)
    return {
      toolName: 'getTransactions',
      result: data.slice(0, 10).map(t => ({
        description: t.description,
        amount: t.amount,
        category: t.category,
        date: t.date,
      })),
    }
  },

  getBudgetStatus(personaId: PersonaId): ToolResult {
    const budget = BudgetService.getBudget(personaId)
    return {
      toolName: 'getBudgetStatus',
      result: {
        income: budget.income,
        totalSpent: budget.totalSpent,
        balance: budget.balance,
        overLimitCategories: budget.categories
          .filter(c => c.isOverLimit)
          .map(c => ({ label: c.label, used: c.used, limit: c.limit })),
      },
    }
  },

  getGoalProgress(personaId: PersonaId): ToolResult {
    const goals = GoalService.list(personaId)
    return {
      toolName: 'getGoalProgress',
      result: goals.map(g => ({
        title: g.title,
        progress: g.progress,
        remaining: g.targetAmount - g.currentAmount,
        deadline: g.deadline,
      })),
    }
  },
}
