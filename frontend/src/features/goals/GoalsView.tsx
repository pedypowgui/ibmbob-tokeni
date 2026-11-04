import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useGoalsController } from './useGoalsController'
import { GoalProgress } from '../../components/GoalProgress'
import type { FinancialGoal } from '../../types'

export function GoalsView() {
  const { goals, loading, error, showForm, setShowForm, addGoal } = useGoalsController()

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Meus Sonhos ✨</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium"
        >
          <Plus size={16} />
          Novo
        </button>
      </div>

      {showForm && <GoalForm onSave={addGoal} onCancel={() => setShowForm(false)} />}

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
      )}

      {error && <p className="text-center text-[var(--color-danger)] text-sm py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🌟</p>
              <p className="text-sm text-[var(--color-muted)]">Nenhum sonho ainda.</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">Adicione seu primeiro objetivo financeiro!</p>
            </div>
          ) : (
            goals.map(goal => (
              <GoalProgress
                key={goal.id}
                title={goal.title}
                emoji={goal.emoji}
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
                progress={goal.progress}
                deadline={goal.deadline}
              />
            ))
          )}
        </div>
      )}
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
        <p className="text-sm font-semibold">Novo sonho</p>
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
            placeholder="Nome do sonho"
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
          Salvar sonho
        </button>
      </div>
    </form>
  )
}
