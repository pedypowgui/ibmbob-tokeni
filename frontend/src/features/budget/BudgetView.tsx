import { useBudgetController } from './useBudgetController'
import { BudgetProgress } from '../../components/BudgetProgress'
import { formatCurrency, formatMonth, categoryLabel } from '../../utils/format'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#1a4731', '#2d6a4f', '#52b788', '#95d5b2', '#b7e4c7', '#d8f3dc', '#7c3aed', '#a78bfa']

export function BudgetView() {
  const { budget, loading, error } = useBudgetController()

  if (loading) return <PageSkeleton />
  if (error || !budget) return <ErrorState message={error ?? 'Sem dados'} />

  const pieData = budget.categories
    .filter(c => c.used > 0)
    .map(c => ({ name: categoryLabel(c.category), value: c.used }))

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-1">Orçamento</h1>
      <p className="text-sm text-[var(--color-muted)] mb-4">{formatMonth(budget.month)}</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[var(--color-primary-muted)] rounded-xl p-3 text-center">
          <p className="text-[10px] text-[var(--color-success)] mb-0.5">Renda</p>
          <p className="text-sm font-bold text-[var(--color-success)]">{formatCurrency(budget.income)}</p>
        </div>
        <div className="bg-[var(--color-danger-light)] rounded-xl p-3 text-center">
          <p className="text-[10px] text-[var(--color-danger)] mb-0.5">Gasto</p>
          <p className="text-sm font-bold text-[var(--color-danger)]">{formatCurrency(budget.totalSpent)}</p>
        </div>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-3 text-center">
          <p className="text-[10px] text-[var(--color-muted)] mb-0.5">Saldo</p>
          <p className={`text-sm font-bold ${budget.balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
            {formatCurrency(budget.balance)}
          </p>
        </div>
      </div>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 mb-4">
          <p className="text-sm font-semibold mb-3">Distribuição de gastos</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] px-4 py-2">
        <p className="text-sm font-semibold py-3 border-b border-[var(--color-border)]">Por categoria</p>
        {budget.categories.map(cat => (
          <BudgetProgress
            key={cat.category}
            label={categoryLabel(cat.category)}
            used={cat.used}
            limit={cat.limit}
            isOverLimit={cat.isOverLimit}
          />
        ))}
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-pulse space-y-4">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}
      </div>
      <div className="h-56 bg-gray-200 rounded-2xl" />
      <div className="h-48 bg-gray-200 rounded-2xl" />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return <div className="max-w-lg mx-auto px-4 pt-16 text-center text-[var(--color-danger)] text-sm">{message}</div>
}
