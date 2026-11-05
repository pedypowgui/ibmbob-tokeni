import { Sparkles, Star, Lock, CheckCircle2, Circle, ChevronRight, Trophy, Zap, Target, ArrowRight, X } from 'lucide-react'
import { useDreamsController } from './useDreamsController'
import type { JourneyDetail, JourneyLevel, JourneyMission } from '../../types'

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, color = 'bg-[var(--color-primary)]', label }: { value: number; color?: string; label?: string }) {
  return (
    <div>
      {label && <span className="text-[11px] text-[var(--color-muted)]">{label}</span>}
      <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

// ─── XP Badge ────────────────────────────────────────────────────────────────

function XpBadge({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-achievement)] bg-opacity-15 text-[var(--color-achievement)] text-[11px] font-semibold">
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
            Concluir
            <ChevronRight size={12} />
          </button>
        )}
        {isDone && (
          <span className="text-[12px] text-[var(--color-success)] font-medium">Concluída ✓</span>
        )}
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
        isDone
          ? 'border-[var(--color-primary)]'
          : isCurrent
          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-opacity-20'
          : 'border-[var(--color-border)]'
      }`}
    >
      {/* Level header */}
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
          {isDone ? '✓' : level.order}
        </div>
        <div className="flex-1">
          <div className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-[var(--color-text)]'}`}>
            Nível {level.order} — {level.title}
          </div>
          {isCurrent && (
            <div className="text-[11px] text-green-200 mt-0.5">Em andamento</div>
          )}
          {isDone && (
            <div className="text-[11px] text-[var(--color-success)] mt-0.5">Concluído</div>
          )}
          {isLocked && (
            <div className="text-[11px] text-[var(--color-muted)] mt-0.5 flex items-center gap-1">
              <Lock size={10} /> Bloqueado
            </div>
          )}
        </div>
      </div>

      {/* Level body */}
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

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onCreateJourney, loading }: { onCreateJourney: () => void; loading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary-muted)] flex items-center justify-center">
        <Star size={36} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Qual é o seu próximo sonho?</h2>
        <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
          Converse com o Tokeni e descubra como transformar seu objetivo em um plano possível, passo a passo.
        </p>
      </div>
      <button
        onClick={onCreateJourney}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 hover:bg-[var(--color-primary-light)] transition-colors"
      >
        <Sparkles size={18} />
        {loading ? 'Criando...' : 'Criar minha jornada'}
        <ArrowRight size={16} />
      </button>
      <p className="text-[11px] text-[var(--color-muted)]">
        Seu plano será personalizado com base na sua situação financeira real.
      </p>
    </div>
  )
}

// ─── Pending Approval State ───────────────────────────────────────────────────

function PendingApprovalState({
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
    <div className="flex flex-col gap-4">
      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center">
            <Target size={20} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">{journey.title}</h2>
            <span className="text-[11px] text-[var(--color-muted)] px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded-full">
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

      {/* Levels preview */}
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

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-2">
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
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-[var(--color-border)] text-[var(--color-muted)] font-medium rounded-2xl disabled:opacity-50 hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] transition-colors"
        >
          Cancelar proposta
        </button>
      </div>
    </div>
  )
}

// ─── Active Journey State ─────────────────────────────────────────────────────

function ActiveJourneyState({
  journey,
  totalXp,
  onComplete,
  loading,
}: {
  journey: JourneyDetail
  totalXp: number
  onComplete: (missionId: string) => void
  loading: boolean
}) {
  const currentLevel = journey.levels.find(l => l.id === journey.currentLevelId)
    || journey.levels.find(l => l.status === 'in_progress')

  const currentMissions = journey.missions.filter(
    m => m.levelId === (currentLevel?.id ?? '')
  )

  const mainMission = currentMissions.find(m => m.type === 'main')
  const secondaryMissions = currentMissions.filter(m => m.type === 'secondary')

  return (
    <div className="flex flex-col gap-4">
      {/* Journey header */}
      <div className="bg-[var(--color-primary)] rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] text-green-300 font-medium">Jornada ativa</div>
            <h2 className="text-base font-bold mt-0.5">{journey.title}</h2>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-green-300">XP total</div>
            <div className="text-lg font-bold flex items-center gap-1 justify-end">
              <Zap size={14} className="text-yellow-300" />
              {totalXp}
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex justify-between text-[11px] text-green-300 mb-1">
              <span>Progresso da jornada</span>
              <span>{journey.journeyProgress}%</span>
            </div>
            <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${journey.journeyProgress}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-green-300 mb-1">
              <span>Progresso financeiro</span>
              <span>{journey.financialProgress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-300 rounded-full transition-all duration-500"
                style={{ width: `${journey.financialProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current level highlight */}
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

      {/* Financial goal summary */}
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

      {/* Next steps — main mission */}
      {mainMission && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2">
            🎯 Missão principal
          </h3>
          <MissionCard mission={mainMission} onComplete={onComplete} loading={loading} />
        </div>
      )}

      {/* Secondary missions */}
      {secondaryMissions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2">
            ⭐ Missões secundárias
          </h3>
          <div className="flex flex-col gap-2">
            {secondaryMissions.map(m => (
              <MissionCard key={m.id} mission={m} onComplete={onComplete} loading={loading} />
            ))}
          </div>
        </div>
      )}

      {/* All levels history */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text)] px-1 mb-2">
          🗺️ Todas as etapas
        </h3>
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
    </div>
  )
}

// ─── Completed Journey State ──────────────────────────────────────────────────

function CompletedJourneyState({
  journey,
  totalXp,
  onNewJourney,
  loading,
}: {
  journey: JourneyDetail
  totalXp: number
  onNewJourney: () => void
  loading: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="w-24 h-24 rounded-3xl bg-[var(--color-achievement)] bg-opacity-15 flex items-center justify-center">
        <Trophy size={44} className="text-[var(--color-achievement)]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Sonho conquistado! 🎉</h2>
        <p className="text-sm text-[var(--color-muted)] mt-2 max-w-xs leading-relaxed">
          Você completou a jornada <strong>"{journey.title}"</strong> com sucesso!
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-[var(--color-border)] p-4 text-left">
        <div className="text-sm font-semibold text-[var(--color-text)] mb-3">Retrospectiva</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--color-primary-muted)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--color-muted)]">XP acumulado</div>
            <div className="text-base font-bold text-[var(--color-primary)] flex items-center gap-1">
              <Zap size={12} />
              {totalXp}
            </div>
          </div>
          <div className="bg-[var(--color-primary-muted)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--color-muted)]">Etapas</div>
            <div className="text-base font-bold text-[var(--color-primary)]">
              {journey.levels.length}/{journey.levels.length} ✓
            </div>
          </div>
          <div className="col-span-2 bg-[var(--color-primary-muted)] rounded-xl p-3">
            <div className="text-[10px] text-[var(--color-muted)]">Progresso financeiro final</div>
            <div className="text-base font-bold text-[var(--color-primary)]">
              R$ {journey.accumulatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {journey.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNewJourney}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50"
      >
        <Sparkles size={18} />
        {loading ? 'Criando...' : 'Iniciar nova jornada'}
      </button>
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
        <button onClick={onDismiss} className="flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function DreamsView() {
  const {
    state,
    loading,
    actionLoading,
    error,
    notification,
    dismissNotification,
    handleCreateJourney,
    handleApproveJourney,
    handleCancelJourney,
    handleCompleteMission,
  } = useDreamsController()

  const journey = state?.journey ?? null
  const totalXp = state?.progress?.totalXp ?? 0

  return (
    <div className="max-w-lg mx-auto flex flex-col min-h-[calc(100dvh-var(--bottom-nav-height))] lg:min-h-dvh">
      {/* Notification */}
      {notification && (
        <NotificationToast message={notification} onDismiss={dismissNotification} />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center">
          <Star size={18} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[var(--color-text)]">Sonhos</h1>
          <p className="text-[10px] text-[var(--color-muted)]">Sua jornada financeira personalizada</p>
        </div>
        {totalXp > 0 && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-achievement)] bg-opacity-10 rounded-xl">
            <Zap size={13} className="text-[var(--color-achievement)]" />
            <span className="text-xs font-bold text-[var(--color-achievement)]">{totalXp} XP</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[var(--color-border)] rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-[var(--color-danger-light)] border border-[var(--color-danger)] rounded-2xl p-4 text-center">
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
            <button
              onClick={handleCreateJourney}
              className="mt-3 text-sm font-medium text-[var(--color-primary)] underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && !journey && (
          <EmptyState onCreateJourney={handleCreateJourney} loading={actionLoading} />
        )}

        {!loading && !error && journey?.status === 'pending_approval' && (
          <PendingApprovalState
            journey={journey}
            onApprove={handleApproveJourney}
            onCancel={handleCancelJourney}
            loading={actionLoading}
          />
        )}

        {!loading && !error && journey?.status === 'active' && (
          <ActiveJourneyState
            journey={journey}
            totalXp={totalXp}
            onComplete={handleCompleteMission}
            loading={actionLoading}
          />
        )}

        {!loading && !error && journey?.status === 'completed' && (
          <CompletedJourneyState
            journey={journey}
            totalXp={totalXp}
            onNewJourney={handleCreateJourney}
            loading={actionLoading}
          />
        )}

        {!loading && !error && journey?.status === 'cancelled' && (
          <EmptyState onCreateJourney={handleCreateJourney} loading={actionLoading} />
        )}
      </div>
    </div>
  )
}
