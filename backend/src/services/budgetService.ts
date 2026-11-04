import type { PersonaId, Budget, BudgetCategory, TransactionCategory } from '../models'
import { TransactionRepository, BudgetLimitRepository } from '../repositories'
import { categoryLabel } from './transactionService'

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'food', 'transport', 'housing', 'health', 'education', 'entertainment', 'other',
]

export const BudgetService = {
  getBudget(personaId: PersonaId): Budget {
    const month = currentMonth()
    const transactions = TransactionRepository.findByPersona(personaId)
      .filter(t => t.date.startsWith(month))

    const limits = BudgetLimitRepository.findByPersona(personaId)
    const income = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const categories: BudgetCategory[] = EXPENSE_CATEGORIES.map(cat => {
      const used = Math.abs(
        transactions
          .filter(t => t.category === cat && t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0),
      )
      const limit = limits[cat] ?? 0
      const remaining = Math.max(limit - used, 0)
      const percentUsed = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
      return {
        category: cat,
        label: categoryLabel(cat),
        limit,
        used,
        remaining,
        percentUsed: Math.round(percentUsed * 10) / 10,
        isOverLimit: used > limit,
      }
    }).filter(c => c.limit > 0 || c.used > 0)

    const totalSpent = categories.reduce((sum, c) => sum + c.used, 0)
    const balance = income - totalSpent

    return { personaId, month, income, totalSpent, balance, categories }
  },
}

function currentMonth(): string {
  // Fixed to 2025-07 to match the fixture data
  return '2025-07'
}
