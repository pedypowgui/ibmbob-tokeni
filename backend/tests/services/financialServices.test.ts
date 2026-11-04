import { BudgetService } from '../../src/services/budgetService'
import { TransactionService } from '../../src/services/transactionService'

describe('BudgetService', () => {
  it('should return a valid budget for jose', () => {
    const budget = BudgetService.getBudget('jose')
    expect(budget.personaId).toBe('jose')
    expect(budget.income).toBeGreaterThan(0)
    expect(budget.categories.length).toBeGreaterThan(0)
    expect(budget.balance).toBe(budget.income - budget.totalSpent)
  })

  it('should return a valid budget for janaina', () => {
    const budget = BudgetService.getBudget('janaina')
    expect(budget.personaId).toBe('janaina')
    expect(budget.income).toBeGreaterThan(0)
  })

  it('should flag over-limit categories correctly', () => {
    const budget = BudgetService.getBudget('jose')
    budget.categories.forEach(cat => {
      expect(cat.isOverLimit).toBe(cat.used > cat.limit)
    })
  })
})

describe('TransactionService', () => {
  it('should list transactions for jose', () => {
    const txs = TransactionService.list('jose')
    expect(txs.length).toBeGreaterThan(0)
    expect(txs[0].personaId).toBe('jose')
  })

  it('should filter by category', () => {
    const txs = TransactionService.list('jose', { category: 'food' })
    txs.forEach(t => expect(t.category).toBe('food'))
  })

  it('should return null for unknown transaction id', () => {
    const tx = TransactionService.getById('jose', 'nonexistent')
    expect(tx).toBeNull()
  })
})
