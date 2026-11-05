import type { PersonaId, DashboardSummary, Alert } from '../models'
import { TransactionRepository } from '../repositories'
import { BudgetService } from './budgetService'

export const DashboardService = {
  getSummary(personaId: PersonaId): DashboardSummary {
    const month = '2025-07'
    const transactions = TransactionRepository.findByPersona(personaId)
      .filter(t => t.date.startsWith(month))

    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = Math.abs(
      transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    )

    const balance = income - totalExpenses

    const budget = BudgetService.getBudget(personaId)
    const alerts: Alert[] = budget.categories
      .filter(c => c.isOverLimit)
      .map(c => ({
        id: `alert-${c.category}`,
        type: 'over_budget' as const,
        message: `Você ultrapassou o limite com ${c.label} este mês.`,
        category: c.category,
      }))

    const recentTransactions = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)

    return { personaId, month, income, totalExpenses, balance, alerts, recentTransactions }
  },
}
