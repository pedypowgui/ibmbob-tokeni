import { useState } from 'react'
import { Plus, X, Target, CheckCircle2, Circle, Lock, Zap } from 'lucide-react'
import { useGoalsController } from './useGoalsController'
import type { FinancialGoal } from '../../types'

// ─── Trail stages derived from progress ───────────────────────────────────────

const STAGES = [
  { min: 0,  max: 25,  label: 'Iniciando',     order: 1 },
  { min: 25, max: 50,  label: 'Em progresso',  order: 2 },
  { min: 50, max: 75,  label: 'Na metade',     order: 3 },
  { min: 75, max: 100, label: 'Quase lá',      order: 4 },
  { min: 100, max: Infinity, label: 'Concluído', order: 5 },
]

function getStage(progress: number) {
  return STAGES.find(s => progress >= s.min && progress < s.max) ?? STAGES[STAGES.length - 1]
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

// ─── Stage Node ───────────────────────────────────────────────────────────────

function StageNode({
  stage,
  isCurrent,
  isDone,
  isLocked,
}: {
  stage: typeof STAGES[number]
  isCurrent: boolean
  isDone: boolean
  isLocked: boolean
}) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDone
          ? 'border-[var(--color-primary)]'
          : isCurrent
          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20'
          : 'border-[var(--color-border)]'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 ${
          isDone
            ? 'bg-[var(--color-primary-muted)]'
            : isCurrent
            ? 'bg-[var(--color-primary)]'
            : 'bg-[var(--color-bg)]'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            isDone
              ? 'bg-[var(--color-primary)] text-white'
              : isCurrent
              ? 'bg-white text-[var(--color-primary)]'
              : 'bg-[var(--color-border)] text-[var(--color-muted)]'
          }`}
        >
          {isDone ? '✓' : stage.order}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-[var(--color-text)]'}`}>
            Etapa {stage.order} — {stage.label}
          </div>
          {isCurrent && <div className="text-[11px] text-green-200 mt-0.5">Em andamento</div>}
          {isDone && <div className="text-[11px] text-[var(--color-success)] mt-0.5">Concluída</div>}
          {isLocked && (
            <div className="text-[11px] text-[var(--color-muted)] mt-0.5 flex items-center gap-1">
              <Lock size={10} /> Bloqueada
            </div>
          )}
        </div>
        {isDone && <CheckCircle2 size={18} className="text-[var(--color-success)] flex-shrink-0" />}
        {isCurrent && <Circle size={18} className="text-white flex-shrink-0" />}
        {isLocked && <Lock size={18} className="text-[var(--color-muted)] flex-shrink-0" />}
      </div>
    </div>
  )
}

// ─── Goal Trail Card ──────────────────────────────────────────────────────────

function GoalTrailCard({ goal }: { goal: FinancialGoal }) {
  const progress = Math.min(100, goal.progress)
  const currentStage = getStage(progress)
  const xpEarned = Math.round(progress * 1.5)

  return (
    <div className="flex flex-col gap-3">
      {/* Journey header */}
      <div className="bg-[var(--color-primary)] rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{goal.emoji}</span>
            <div>
              <div className="text-[11px] text-green-300 font-medium">Meta ativa</div>
              <h2 className="text-base font-bold mt-0.5">{goal.title}</h2>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-green-300">XP</div>
            <div className="text-lg font-bold flex items-center gap-1 justify-end">
              <Zap size={14} className="text-yellow-300" />
              {xpEarned}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-[11px] text-green-300 mb-1">
            <span>Progresso financeiro</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[var(--color-primary)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Meta financeira</span>
          <span className="ml-auto text-[11px] text-[var(--color-muted)]">Até {formatDate(goal.deadline)}</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[11px] text-[var(--color-muted)]">Acumulado</div>
            <div className="text-base font-bold text-[var(--color-primary)]">{formatCurrency(goal.currentAmount)}</div>
          </div>
          <div className="text-[var(--color-muted)] text-sm">de</div>
          <div className="text-right">
            <div className="text-[11px] text-[var(--color-muted)]">Meta</div>
            <div className="text-base font-bold text-[var(--color-text)]">{formatCurrency(goal.targetAmount)}</div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Trail stages */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2">🗺️ Trilha da meta</h3>
        <div className="flex flex-col gap-2">
          {STAGES.filter(s => s.max !== Infinity || progress >= 100).map(stage => {
            const isDone = progress >= stage.max || (stage.max === Infinity && progress >= 100)
            const isCurrent = stage.order === currentStage.order && progress < 100
            const isLocked = stage.order > currentStage.order
            return (
              <StageNode
                key={stage.order}
                stage={stage}
                isCurrent={isCurrent}
                isDone={isDone}
                isLocked={isLocked}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function GoalsView() {
  const { goals, loading, error, showForm, setShowForm, addGoal } = useGoalsController()

  return (
    <div className="max-w-lg mx-auto flex flex-col min-h-[calc(100dvh-var(--bottom-nav-height))] lg:min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center">
          <Target size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[var(--color-text)]">Metas</h1>
          <p className="text-[10px] text-[var(--color-muted)]">Sua trilha de objetivos financeiros</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          Nova
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showForm && <GoalForm onSave={addGoal} onCancel={() => setShowForm(false)} />}

        {loading && (
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(2)].map((_, i) => <div key={i} className="h-40 bg-[var(--color-border)] rounded-2xl" />)}
          </div>
        )}

        {error && <p className="text-center text-[var(--color-danger)] text-sm py-8">{error}</p>}

        {!loading && !error && goals.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[var(--color-primary-muted)] flex items-center justify-center">
              <Target size={30} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-base font-bold text-[var(--color-text)]">Nenhuma meta ainda</p>
              <p className="text-sm text-[var(--color-muted)] mt-1">Adicione seu primeiro objetivo financeiro!</p>
            </div>
          </div>
        )}

        {!loading && !error && goals.length > 0 && (
          <div className="flex flex-col gap-8">
            {goals.map(goal => (
              <GoalTrailCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface GoalFormProps {
  onSave: (payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>) => void
  onCancel: () => void
}

function GoalForm({ onSave, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [deadline, setDeadline] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !targetAmount || !deadline) return
    onSave({
      title,
      emoji,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">Nova meta</p>
        <button type="button" onClick={onCancel}><X size={18} className="text-[var(--color-muted)]" /></button>
      </div>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
            className="w-14 border border-[var(--color-border)] rounded-xl px-3 py-2 text-center text-lg"
            maxLength={2}
          />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nome da meta"
            className="flex-1 border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm"
            required
          />
        </div>
        <input
          type="number"
          value={targetAmount}
          onChange={e => setTargetAmount(e.target.value)}
          placeholder="Valor meta (R$)"
          className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm"
          required
          min={1}
        />
        <input
          type="number"
          value={currentAmount}
          onChange={e => setCurrentAmount(e.target.value)}
          placeholder="Já tenho (R$)"
          className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm"
          min={0}
        />
        <input
          type="date"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium"
        >
          Salvar meta
        </button>
      </div>
    </form>
  )
}
