import { nanoid } from 'nanoid'
import type { PersonaId, FinancialGoal } from '../models'
import { GoalRepository } from '../repositories'
import { JourneyService } from './journeyService'

export const GoalService = {
  list(personaId: PersonaId): FinancialGoal[] {
    return GoalRepository.findByPersona(personaId)
  },

  getById(personaId: PersonaId, id: string): FinancialGoal | null {
    return GoalRepository.findById(personaId, id)
  },

  create(
    personaId: PersonaId,
    payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>,
  ): FinancialGoal {
    const progress = payload.targetAmount > 0
      ? Math.min((payload.currentAmount / payload.targetAmount) * 100, 100)
      : 0
    const goal: FinancialGoal = {
      id: nanoid(8),
      personaId,
      ...payload,
      progress: Math.round(progress * 100) / 100,
    }
    GoalRepository.save(personaId, goal)

    // Criar jornada vinculada automaticamente
    try {
      JourneyService.createJourneyFromGoal(personaId, {
        id: goal.id,
        title: goal.title,
        emoji: goal.emoji,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline,
      })
    } catch {
      // Jornada já existe para esta meta — ignorar silenciosamente
    }

    return goal
  },

  update(
    personaId: PersonaId,
    id: string,
    patch: Partial<Omit<FinancialGoal, 'id' | 'personaId'>>,
  ): FinancialGoal | null {
    const existing = GoalRepository.findById(personaId, id)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    updated.progress = updated.targetAmount > 0
      ? Math.min((updated.currentAmount / updated.targetAmount) * 100, 100)
      : 0
    updated.progress = Math.round(updated.progress * 100) / 100
    return GoalRepository.save(personaId, updated)
  },
}
