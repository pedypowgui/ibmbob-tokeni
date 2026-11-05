import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingDown, TrendingUp, Wallet, AlertTriangle,
  Settings, X, Sun, Moon, LogOut, Pencil, Check,
} from 'lucide-react'
import { useDashboardController } from './useDashboardController'
import { usePersona } from '../../hooks/usePersona'
import { useTheme } from '../../hooks/useTheme'
import { useProfile } from '../../hooks/useProfile'
import { FinancialCard } from '../../components/FinancialCard'
import { TransactionItem } from '../../components/TransactionItem'
import { formatCurrency } from '../../utils/format'

// ─── Profile Drawer ────────────────────────────────────────────────────────────

function ProfileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { personaId, clearPersona } = usePersona()
  const { theme, toggleTheme } = useTheme()
  const { displayName, avatar, role, banks, saveName, toggleBank } = useProfile(personaId)
  const navigate = useNavigate()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(displayName)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync name input when displayName changes (e.g. persona switch)
  useEffect(() => { setNameInput(displayName) }, [displayName])

  // Focus input when editing starts
  useEffect(() => {
    if (editingName) inputRef.current?.focus()
  }, [editingName])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function commitName() {
    const trimmed = nameInput.trim()
    if (trimmed) saveName(trimmed)
    else setNameInput(displayName)
    setEditingName(false)
  }

  function handleLogout() {
    clearPersona()
    navigate('/')
  }

  const connectedCount = banks.filter(b => b.connected).length

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(360px,100vw)] bg-[var(--color-surface)] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-safe pt-5 pb-4 border-b border-[var(--color-border)]">
          <span className="text-base font-bold text-[var(--color-text)]">Perfil & configurações</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--color-border)] transition-colors"
          >
            <X size={18} className="text-[var(--color-muted)]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

          {/* ── Avatar + nome ── */}
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={displayName}
              className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 ring-2 ring-[var(--color-border)]"
            />
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setEditingName(false); setNameInput(displayName) } }}
                    className="flex-1 text-sm font-semibold bg-transparent border-b-2 border-[var(--color-primary)] text-[var(--color-text)] outline-none pb-0.5"
                    maxLength={40}
                  />
                  <button
                    onClick={commitName}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[var(--color-primary)] text-white flex-shrink-0"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--color-text)] truncate">{displayName}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="flex-shrink-0 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              )}
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{role}</p>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          {/* ── Aparência ── */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">Aparência</h3>
            <div className="flex items-center justify-between bg-[var(--color-bg)] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                {theme === 'dark'
                  ? <Moon size={18} className="text-[var(--color-primary)]" />
                  : <Sun size={18} className="text-[var(--color-achievement)]" />
                }
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Tema {theme === 'dark' ? 'escuro' : 'claro'}
                  </p>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    {theme === 'dark' ? 'Modo noturno ativado' : 'Modo diurno ativado'}
                  </p>
                </div>
              </div>
              {/* Toggle switch */}
              <button
                onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${theme === 'dark' ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${theme === 'dark' ? 'left-6' : 'left-0.5'}`}
                />
              </button>
            </div>
          </section>

          <div className="h-px bg-[var(--color-border)]" />

          {/* ── Bancos conectados ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
                Bancos conectados
              </h3>
              {connectedCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 bg-[var(--color-primary-muted)] text-[var(--color-primary)] rounded-full font-medium">
                  {connectedCount} ativo{connectedCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {banks.map(bank => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between bg-[var(--color-bg)] rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{bank.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">{bank.name}</p>
                      <p className="text-[11px] text-[var(--color-muted)]">
                        {bank.connected ? 'Conectado — dados sincronizados' : 'Não conectado'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBank(bank.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${bank.connected ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${bank.connected ? 'left-5' : 'left-0.5'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--color-muted)] mt-2 px-1">
              A conexão com bancos é simulada nesta versão demo.
            </p>
          </section>

          <div className="h-px bg-[var(--color-border)]" />

          {/* ── Conta ── */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">Conta</h3>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] rounded-2xl px-4 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <LogOut size={16} />
              Sair da conta
            </button>
          </section>

        </div>

        {/* Footer */}
        <div className="px-5 pb-safe pb-5 pt-3 border-t border-[var(--color-border)]">
          <p className="text-[11px] text-[var(--color-muted)] text-center">tokeni · versão demo</p>
        </div>
      </div>
    </>
  )
}

// ─── Dashboard View ────────────────────────────────────────────────────────────

export function DashboardView() {
  const { summary, loading, error } = useDashboardController()
  const { personaId } = usePersona()
  const { displayName } = useProfile(personaId)
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Apply theme on mount
  useTheme()

  if (loading) return <PageSkeleton />
  if (error) return <ErrorState message={error} />

  const firstName = displayName.split(' ')[0]

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-[var(--color-muted)]">Bem-vindo de volta</p>
          <h1 className="text-xl font-bold text-[var(--color-text)]">Olá, {firstName} 👋</h1>
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] text-[var(--color-muted)] transition-colors"
          aria-label="Configurações de perfil"
        >
          <Settings size={20} />
        </button>
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
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
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
        className="mt-4 w-full flex items-center justify-between bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-[var(--color-primary)]" />
          <span className="text-sm font-medium text-[var(--color-text)]">Ver orçamento mensal</span>
        </div>
        <span className="text-[var(--color-muted)] text-lg">›</span>
      </button>

      {/* Profile settings drawer */}
      <ProfileDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 animate-pulse space-y-4">
      <div className="h-6 w-32 bg-[var(--color-border)] rounded" />
      <div className="h-36 bg-[var(--color-border)] rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-[var(--color-border)] rounded-2xl" />
        <div className="h-20 bg-[var(--color-border)] rounded-2xl" />
      </div>
      <div className="h-48 bg-[var(--color-border)] rounded-2xl" />
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
