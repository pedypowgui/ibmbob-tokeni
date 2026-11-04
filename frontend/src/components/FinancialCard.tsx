interface FinancialCardProps {
  label: string
  value: string
  sub?: string
  variant?: 'default' | 'income' | 'expense' | 'balance'
}

const variantStyles: Record<string, string> = {
  default: 'bg-white border border-[var(--color-border)]',
  income: 'bg-[var(--color-primary-muted)] border border-green-200',
  expense: 'bg-[var(--color-danger-light)] border border-red-200',
  balance: 'bg-[var(--color-primary)] text-white',
}

const valueStyles: Record<string, string> = {
  default: 'text-[var(--color-text)]',
  income: 'text-[var(--color-success)]',
  expense: 'text-[var(--color-danger)]',
  balance: 'text-white',
}

const labelStyles: Record<string, string> = {
  default: 'text-[var(--color-muted)]',
  income: 'text-[var(--color-success)]',
  expense: 'text-[var(--color-danger)]',
  balance: 'text-green-200',
}

export function FinancialCard({ label, value, sub, variant = 'default' }: FinancialCardProps) {
  return (
    <div className={`rounded-2xl p-4 ${variantStyles[variant]}`}>
      <p className={`text-xs font-medium mb-1 ${labelStyles[variant]}`}>{label}</p>
      <p className={`text-xl font-bold ${valueStyles[variant]}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 opacity-70 ${labelStyles[variant]}`}>{sub}</p>}
    </div>
  )
}
