import { useState } from 'react'
import {
  Sparkles, Star, Lock, CheckCircle2, Circle, ChevronRight, Trophy,
  Zap, Target, ArrowRight, X, Plus, Map,
} from 'lucide-react'
import { useDreamsController } from './useDreamsController'
import type { JourneyDetail, JourneyLevel, JourneyMission, FinancialGoal } from '../../types'

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, color = 'bg-[var(--color-primary)]' }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// ─── XP Badge ────────────────────────────────────────────────────────────────

function XpBadge({ xp }: { xp: number }) {
  return (
    <span className="max-w-16 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-achievement)] bg-opacity-15 text-orange-100 text-[11px] font-semibold">
      <Zap size={10} />
      {xp} XP
    </span>
  )
}

// ─── Mission Status Icon ──────────────────────────────────────────────────────

function MissionStatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 size={18} className="text-[var(--color-success)] flex-shrink-0" />
  if (status === 'locked') return <Lock size={18} className="text-[var(--color-muted)] flex-shrink-0" />
  return <Circle size={18} className="text-[var(--color-primary)] flex-shrink-0" />
}

// ─── Completion Type Label ────────────────────────────────────────────────────

function completionLabel(type: string): string {
  switch (type) {
    case 'automatic': return 'Verificado automaticamente'
    case 'manual': return 'Confirmação manual'
    case 'educational': return 'Atividade educativa'
    case 'financial': return 'Meta financeira'
    default: return type
  }
}

// ─── Mission Card ─────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  onComplete,
  loading,
}: {
  mission: JourneyMission
  onComplete: (id: string) => void
  loading: boolean
}) {
  const isAvailable = mission.status === 'available' || mission.status === 'in_progress'
  const isDone = mission.status === 'completed'
  const isMain = mission.type === 'main'

  return (
    <div
      className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all ${
        isDone
          ? 'bg-[var(--color-primary-muted)] border-[var(--color-primary)]'
          : isAvailable
          ? 'bg-white border-[var(--color-border)] hover:border-[var(--color-primary)]'
          : 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <MissionStatusIcon status={mission.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[var(--color-text)] leading-tight">{mission.title}</span>
            {isMain && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary)] text-white font-medium">
                Principal
              </span>
            )}
          </div>
          <p className="text-[12px] text-[var(--color-muted)] mt-1 leading-relaxed">{mission.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <XpBadge xp={mission.rewardXp} />
          <span className="text-[10px] text-[var(--color-muted)]">{completionLabel(mission.completionType)}</span>
        </div>
        {isAvailable && !isDone && (
          <button
            onClick={() => onComplete(mission.id)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)] text-white text-[12px] font-medium rounded-xl disabled:opacity-50 hover:bg-[var(--color-primary-light)] transition-colors"
          >
            Concluir <ChevronRight size={12} />
          </button>
        )}
        {isDone && <span className="text-[12px] text-[var(--color-success)] font-medium">Concluída ✓</span>}
      </div>
    </div>
  )
}

// ─── Level Card ───────────────────────────────────────────────────────────────

function LevelCard({
  level,
  missions,
  isCurrent,
  onComplete,
  loading,
}: {
  level: JourneyLevel
  missions: JourneyMission[]
  isCurrent: boolean
  onComplete: (missionId: string) => void
  loading: boolean
}) {
  const isLocked = level.status === 'locked'
  const isDone = level.status === 'completed'
  const levelMissions = missions.filter(m => m.levelId === level.id)

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDone ? 'border-[var(--color-primary)]'
          : isCurrent ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20'
          : 'border-[var(--color-border)]'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 ${
          isDone ? 'bg-[var(--color-primary-muted)]'
            : isCurrent ? 'bg-[var(--color-primary)]'
            : 'bg-[var(--color-bg)]'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            isDone ? 'bg-[var(--color-primary)] text-white'
              : isCurrent ? 'bg-white text-[var(--color-primary)]'
              : 'bg-[var(--color-border)] text-[var(--color-muted)]'
          }`}
        >
          {isDone ? '✓' : level.order}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-[var(--color-text)]'}`}>
            Nível {level.order} — {level.title}
          </div>
          {isCurrent && <div className="text-[11px] text-green-200 mt-0.5">Em andamento</div>}
          {isDone && <div className="text-[11px] text-[var(--color-success)] mt-0.5">Concluído</div>}
          {isLocked && (
            <div className="text-[11px] text-[var(--color-muted)] mt-0.5 flex items-center gap-1">
              <Lock size={10} /> Bloqueado
            </div>
          )}
        </div>
      </div>

      {!isLocked && (
        <div className="px-4 py-3 bg-white flex flex-col gap-2">
          <p className="text-[12px] text-[var(--color-muted)]">{level.objective}</p>
          {levelMissions.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {levelMissions.map(m => (
                <MissionCard key={m.id} mission={m} onComplete={onComplete} loading={loading} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Pending Approval State ───────────────────────────────────────────────────

function PendingApprovalCard({
  journey,
  onApprove,
  onCancel,
  loading,
}: {
  journey: JourneyDetail
  onApprove: (id: string) => void
  onCancel: (id: string) => void
  loading: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center text-2xl flex-shrink-0">
            {journey.emoji ?? '✨'}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[var(--color-text)]">{journey.title}</h2>
            <span className="text-[11px] px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-700">
              Aguardando aprovação
            </span>
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{journey.description}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--color-bg)] rounded-xl px-3 py-2">
            <div className="text-[10px] text-[var(--color-muted)]">Meta financeira</div>
            <div className="text-sm font-bold text-[var(--color-text)]">
              R$ {journey.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-[var(--color-bg)] rounded-xl px-3 py-2">
            <div className="text-[10px] text-[var(--color-muted)]">Níveis</div>
            <div className="text-sm font-bold text-[var(--color-text)]">{journey.levels.length} etapas</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)] px-1">Etapas da jornada</h3>
        {journey.levels.map((level, idx) => (
          <div key={level.id} className="bg-white rounded-2xl border border-[var(--color-border)] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-muted)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)] flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{level.title}</div>
                <div className="text-[11px] text-[var(--color-muted)]">{level.objective}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onApprove(journey.id)}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 hover:bg-[var(--color-primary-light)] transition-colors"
        >
          <CheckCircle2 size={18} />
          {loading ? 'Aprovando...' : 'Aprovar e iniciar jornada'}
        </button>
        <button
          onClick={() => onCancel(journey.id)}
          disabled={loading}
          className="w-full py-3 bg-white border border-[var(--color-border)] text-[var(--color-muted)] font-medium rounded-2xl disabled:opacity-50 hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] transition-colors"
        >
          Cancelar proposta
        </button>
      </div>
    </div>
  )
}

// ─── Active Journey Card ──────────────────────────────────────────────────────

function ActiveJourneyCard({
  journey,
  totalXp,
  onComplete,
  onCancel,
  loading,
}: {
  journey: JourneyDetail
  totalXp: number
  onComplete: (missionId: string) => void
  onCancel: (id: string) => void
  loading: boolean
}) {
  const currentLevel = journey.levels.find(l => l.id === journey.currentLevelId)
    || journey.levels.find(l => l.status === 'in_progress')

  const currentMissions = journey.missions.filter(m => m.levelId === (currentLevel?.id ?? ''))
  const mainMission = currentMissions.find(m => m.type === 'main')
  const secondaryMissions = currentMissions.filter(m => m.type === 'secondary')

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="bg-[var(--color-primary)] rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {journey.emoji && <span className="text-2xl">{journey.emoji}</span>}
            <div>
              <div className="text-[11px] text-green-300 font-medium">Jornada ativa</div>
              <h2 className="text-base font-bold mt-0.5">{journey.title}</h2>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-green-300">XP total</div>
            <div className="text-lg font-bold flex items-center gap-1 justify-end">
              <Zap size={14} className="text-yellow-300" />
              {totalXp}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between text-[11px] text-green-300 mb-1">
              <span>Progresso da jornada</span>
              <span>{journey.journeyProgress}%</span>
            </div>
            <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${journey.journeyProgress}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-green-300 mb-1">
              <span>Progresso financeiro</span>
              <span>{journey.financialProgress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div className="h-full bg-blue-300 rounded-full transition-all duration-500" style={{ width: `${journey.financialProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Nível atual */}
      {currentLevel && (
        <div className="bg-white rounded-2xl border border-[var(--color-primary)] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-[var(--color-achievement)]" />
            <span className="text-[11px] text-[var(--color-muted)] font-medium">Nível atual</span>
          </div>
          <div className="text-base font-bold text-[var(--color-text)]">
            Nível {currentLevel.order} — {currentLevel.title}
          </div>
          <p className="text-[12px] text-[var(--color-muted)] mt-1">{currentLevel.objective}</p>
        </div>
      )}

      {/* Meta financeira */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={16} className="text-[var(--color-primary)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">Meta financeira</span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[11px] text-[var(--color-muted)]">Acumulado</div>
            <div className="text-base font-bold text-[var(--color-primary)]">
              R$ {journey.accumulatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-[var(--color-muted)] text-sm">de</div>
          <div className="text-right">
            <div className="text-[11px] text-[var(--color-muted)]">Meta</div>
            <div className="text-base font-bold text-[var(--color-text)]">
              R$ {journey.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={journey.financialProgress} color="bg-blue-400" />
        </div>
      </div>

      {/* Missão principal */}
      {mainMission && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2 flex items-center gap-1.5"><Target size={14} /> Missão principal</h3>
          <MissionCard mission={mainMission} onComplete={onComplete} loading={loading} />
        </div>
      )}

      {/* Missões secundárias */}
      {secondaryMissions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2 flex items-center gap-1.5"><Star size={14} /> Missões secundárias</h3>
          <div className="flex flex-col gap-2">
            {secondaryMissions.map(m => (
              <MissionCard key={m.id} mission={m} onComplete={onComplete} loading={loading} />
            ))}
          </div>
        </div>
      )}

      {/* Todas as etapas */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2 flex items-center gap-1.5"><Map size={14} /> Todas as etapas</h3>
        <div className="flex flex-col gap-2">
          {journey.levels.map(level => (
            <LevelCard
              key={level.id}
              level={level}
              missions={journey.missions}
              isCurrent={level.id === currentLevel?.id}
              onComplete={onComplete}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Cancelar jornada */}
      <button
        onClick={() => onCancel(journey.id)}
        disabled={loading}
        className="w-full py-2.5 border border-[var(--color-border)] text-[var(--color-muted)] text-sm rounded-2xl hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] transition-colors disabled:opacity-50"
      >
        Cancelar jornada
      </button>
    </div>
  )
}

// ─── Completed Journey Card ───────────────────────────────────────────────────

function CompletedJourneyCard({
  journey,
  totalXp,
}: {
  journey: JourneyDetail
  totalXp: number
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[var(--color-achievement)] bg-opacity-15 flex items-center justify-center">
        {journey.emoji
          ? <span className="text-4xl">{journey.emoji}</span>
          : <Trophy size={36} className="text-[var(--color-achievement)]" />
        }
      </div>
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text)] flex items-center justify-center gap-2"><Trophy size={18} className="text-[var(--color-achievement)]" /> Sonho conquistado!</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1 max-w-xs leading-relaxed">
          Você completou <strong>"{journey.title}"</strong>!
        </p>
      </div>
      <div className="w-full bg-white rounded-2xl border border-[var(--color-border)] p-4 text-left">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-primary-muted)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--color-muted)]">XP acumulado</div>
            <div className="text-base font-bold text-[var(--color-primary)] flex items-center gap-1">
              <Zap size={12} />{totalXp}
            </div>
          </div>
          <div className="bg-[var(--color-primary-muted)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--color-muted)]">Etapas</div>
            <div className="text-base font-bold text-[var(--color-primary)]">
              {journey.levels.length}/{journey.levels.length} ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Notification Toast ───────────────────────────────────────────────────────

function NotificationToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[var(--color-primary)] text-white rounded-2xl px-4 py-3 flex items-start gap-3 shadow-lg">
        <Sparkles size={18} className="flex-shrink-0 mt-0.5" />
        <span className="text-sm flex-1">{message}</span>
        <button onClick={onDismiss} className="flex-shrink-0"><X size={16} /></button>
      </div>
    </div>
  )
}

// ─── New Dream Form ───────────────────────────────────────────────────────────

function NewDreamForm({
  onSave,
  onCancel,
  loading,
}: {
  onSave: (payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('✨')
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
          placeholder="Valor objetivo (R$)"
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
          disabled={loading}
          className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Criando sonho...' : 'Criar sonho e jornada'}
        </button>
      </div>
    </form>
  )
}

// ─── Journey Card (dispatches by status) ─────────────────────────────────────

function JourneyCard({
  journey,
  totalXp,
  onApprove,
  onCancel,
  onComplete,
  loading,
}: {
  journey: JourneyDetail
  totalXp: number
  onApprove: (id: string) => void
  onCancel: (id: string) => void
  onComplete: (missionId: string) => void
  loading: boolean
}) {
  if (journey.status === 'pending_approval') {
    return (
      <PendingApprovalCard
        journey={journey}
        onApprove={onApprove}
        onCancel={onCancel}
        loading={loading}
      />
    )
  }
  if (journey.status === 'active') {
    return (
      <ActiveJourneyCard
        journey={journey}
        totalXp={totalXp}
        onComplete={onComplete}
        onCancel={onCancel}
        loading={loading}
      />
    )
  }
  if (journey.status === 'completed') {
    return <CompletedJourneyCard journey={journey} totalXp={totalXp} />
  }
  return null
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary-muted)] flex items-center justify-center">
        <Star size={36} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Qual é o seu próximo sonho?</h2>
        <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
          Adicione uma meta e transforme ela em uma jornada com níveis, missões e XP.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-2xl hover:bg-[var(--color-primary-light)] transition-colors"
      >
        <Sparkles size={18} />
        Adicionar meu primeiro sonho
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DreamsView() {
  const [showForm, setShowForm] = useState(false)

  const {
    journeys,
    progress,
    loading,
    actionLoading,
    error,
    notification,
    dismissNotification,
    handleCreateGoal,
    handleApproveJourney,
    handleCancelJourney,
    handleCompleteMission,
  } = useDreamsController()

  const totalXp = progress?.totalXp ?? 0

  async function onFormSave(payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>) {
    const result = await handleCreateGoal(payload)
    if (result) setShowForm(false)
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col min-h-[calc(100dvh-var(--bottom-nav-height))] lg:min-h-dvh">
      {notification && <NotificationToast message={notification} onDismiss={dismissNotification} />}

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center">
          <Star size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[var(--color-text)]">Meus Sonhos</h1>
          <p className="text-[10px] text-[var(--color-muted)]">Cada meta vira uma jornada com níveis e missões</p>
        </div>
        <div className="flex items-center gap-2">
          {totalXp > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--color-achievement)] bg-opacity-10 rounded-xl">
              <Zap size={13} className="text-orange-100" />
              <span className="text-xs font-bold text-orange-100">{totalXp} XP</span>
            </div>
          )}
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium"
          >
            <Plus size={16} />
            Novo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {showForm && (
          <NewDreamForm
            onSave={onFormSave}
            onCancel={() => setShowForm(false)}
            loading={actionLoading}
          />
        )}

        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-[var(--color-border)] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)] rounded-2xl p-4 text-center">
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          </div>
        )}

        {!loading && !error && journeys.length === 0 && !showForm && (
          <EmptyState onAdd={() => setShowForm(true)} />
        )}

        {!loading && !error && journeys.length > 0 && (
          <div className="flex flex-col gap-10">
            {journeys.map(journey => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                totalXp={totalXp}
                onApprove={handleApproveJourney}
                onCancel={handleCancelJourney}
                onComplete={handleCompleteMission}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
