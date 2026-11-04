import { useNavigate } from 'react-router-dom'
import { TrendingDown, TrendingUp, Wallet, AlertTriangle } from 'lucide-react'
import { useDashboardController } from './useDashboardController'
import { usePersona } from '../../hooks/usePersona'
import { FinancialCard } from '../../components/FinancialCard'
import { TransactionItem } from '../../components/TransactionItem'
import { formatCurrency, formatMonth } from '../../utils/format'

export function DashboardView() {
  const { summary, loading, error } = useDashboardController()
  const { personaId } = usePersona()
  const navigate = useNavigate()

  if (loading) return <PageSkeleton />
  if (error) return <ErrorState message={error} />

  const personaName = personaId === 'jose' ? 'José' : 'Janaína'

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-[var(--color-muted)]">Olá,</p>
          <h1 className="text-xl font-bold text-[var(--color-text)]">{personaName} 👋</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--color-muted)]">{summary ? formatMonth(summary.month) : ''}</p>
        </div>
      </div>

      {/* Balance hero card */}
      {summary && (
        <div className="bg-[var(--color-primary)] rounded-2xl p-5 mb-4 text-white">
          <p className="text-sm text-green-200 mb-1">Saldo disponível</p>
          <p className="text-3xl font-bold mb-3">{formatCurrency(summary.balance)}</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={16} className="text-green-300" />
              <div>
                <p className="text-[10px] text-green-200">Entradas</p>
                <p className="text-sm font-semibold">{formatCurrency(summary.income)}</p>
              </div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <TrendingDown size={16} className="text-red-300" />
              <div>
                <p className="text-[10px] text-green-200">Saídas</p>
                <p className="text-sm font-semibold">{formatCurrency(summary.totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {summary && summary.alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {summary.alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick stats */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <FinancialCard
            label="Renda mensal"
            value={formatCurrency(summary.income)}
            variant="income"
          />
          <FinancialCard
            label="Total de gastos"
            value={formatCurrency(summary.totalExpenses)}
            variant="expense"
          />
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Últimas movimentações</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-xs text-[var(--color-primary)] font-medium"
          >
            Ver todas
          </button>
        </div>
        {summary?.recentTransactions.map(t => (
          <TransactionItem key={t.id} transaction={t} />
        ))}
        {(!summary || summary.recentTransactions.length === 0) && (
          <p className="text-sm text-[var(--color-muted)] text-center py-4">Sem movimentações recentes</p>
        )}
      </div>

      {/* Wallet shortcut */}
      <button
        onClick={() => navigate('/budget')}
        className="mt-4 w-full flex items-center justify-between bg-white rounded-2xl border border-[var(--color-border)] px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-text)]">Ver orçamento mensal</span>
        </div>
        <span className="text-[var(--color-muted)] text-lg">›</span>
      </button>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-pulse space-y-4">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="h-36 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-2xl" />
      </div>
      <div className="h-48 bg-gray-200 rounded-2xl" />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-lg mx-auto px-4 pt-16 text-center">
      <p className="text-[var(--color-danger)] text-sm">{message}</p>
    </div>
  )
}
