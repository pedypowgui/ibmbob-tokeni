import { useTransactionsController } from './useTransactionsController'
import { TransactionItem } from '../../components/TransactionItem'
import type { TransactionCategory } from '../../types'

const CATEGORIES: Array<{ value: TransactionCategory | ''; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'food', label: 'Alimentação' },
  { value: 'transport', label: 'Transporte' },
  { value: 'housing', label: 'Moradia' },
  { value: 'health', label: 'Saúde' },
  { value: 'education', label: 'Educação' },
  { value: 'entertainment', label: 'Lazer' },
  { value: 'salary', label: 'Salário' },
  { value: 'other', label: 'Outros' },
]

export function TransactionsView() {
  const { transactions, loading, error, categoryFilter, setCategoryFilter } =
    useTransactionsController()

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-4">Extrato</h1>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 scrollbar-none">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategoryFilter(value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              categoryFilter === value
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-[var(--color-muted)] border-[var(--color-border)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-[var(--color-danger)] text-sm py-8">{error}</p>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] px-4">
          {transactions.length === 0 ? (
            <p className="text-center text-[var(--color-muted)] text-sm py-8">
              Nenhuma transação encontrada.
            </p>
          ) : (
            transactions.map(t => <TransactionItem key={t.id} transaction={t} />)
          )}
        </div>
      )}
    </div>
  )
}
