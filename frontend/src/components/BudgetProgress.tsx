interface BudgetProgressProps {
  label: string
  used: number
  limit: number
  isOverLimit: boolean
}

export function BudgetProgress({ label, used, limit, isOverLimit }: BudgetProgressProps) {
  const percent = Math.min((used / limit) * 100, 100)
  const barColor = isOverLimit
    ? 'bg-[var(--color-danger)]'
    : percent > 80
    ? 'bg-amber-400'
    : 'bg-[var(--color-primary)]'

  return (
    <div className="py-3 border-b border-[var(--color-border)] last:border-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
        <span className={`text-xs font-semibold ${isOverLimit ? 'text-[var(--color-danger)]' : 'text-[var(--color-muted)]'}`}>
          {formatCurrency(used)} / {formatCurrency(limit)}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-[var(--color-border)]">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
