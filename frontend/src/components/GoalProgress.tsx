interface GoalProgressProps {
  title: string
  emoji: string
  currentAmount: number
  targetAmount: number
  progress: number
  deadline: string
}

export function GoalProgress({ title, emoji, currentAmount, targetAmount, progress, deadline }: GoalProgressProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[var(--color-border)]">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
          <p className="text-xs text-[var(--color-muted)]">Até {formatDate(deadline)}</p>
        </div>
        <span className="text-sm font-bold text-[var(--color-primary)]">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-[var(--color-border)]">
        <div
          className="h-2.5 rounded-full bg-[var(--color-primary)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-[var(--color-muted)]">{formatCurrency(currentAmount)}</span>
        <span className="text-xs font-medium text-[var(--color-text)]">{formatCurrency(targetAmount)}</span>
      </div>
    </div>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}
