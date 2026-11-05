import type { Transaction } from '../types'
import { formatCurrency, formatDate, categoryLabel, categoryIcon } from '../utils/format'

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.amount < 0

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
      <div className="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-muted)] flex-shrink-0">
        {categoryIcon(transaction.category)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text)] truncate">{transaction.description}</p>
        <p className="text-xs text-[var(--color-muted)]">
          {categoryLabel(transaction.category)} · {formatDate(transaction.date)}
        </p>
      </div>
      <span className={`text-sm font-bold flex-shrink-0 ${isExpense ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}>
        {isExpense ? '' : '+'}{formatCurrency(transaction.amount)}
      </span>
    </div>
  )
}
