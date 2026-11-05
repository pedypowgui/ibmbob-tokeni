import type { Request, Response } from 'express'
import { z } from 'zod'
import { ok, fail } from '../models'
import type { PersonaId } from '../models'
import { JourneyService } from '../services/journeyService'

// ─── Schemas de validação ─────────────────────────────────────────────────────

const completionCriteriaSchema = z.object({
  type: z.string(),
  description: z.string(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
})

const missionDefSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  rewardXp: z.number().int().positive(),
  completionType: z.enum(['automatic', 'manual', 'educational', 'financial']),
  completionCriteria: completionCriteriaSchema,
})

const levelDefSchema = z.object({
  order: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  objective: z.string().min(1),
  mainMission: missionDefSchema,
  secondaryMissions: z.array(missionDefSchema).default([]),
})

const proposalSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  targetAmount: z.number().positive(),
  levels: z.array(levelDefSchema).min(1),
})

// ─── Controller ───────────────────────────────────────────────────────────────

export const JourneyController = {
  /** GET /api/journey/:personaId — retorna jornada ativa + progresso */
  getJourney(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const journey = JourneyService.getActiveJourney(profileId)
    const progress = JourneyService.getUserProgress(profileId)
    res.json(ok({ journey, progress }))
  },

  /** POST /api/journey/:personaId — cria jornada a partir de proposta */
  createJourney(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const parsed = proposalSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json(fail('VALIDATION_ERROR', parsed.error.message))
      return
    }
    try {
      const journey = JourneyService.createJourneyFromProposal(profileId, parsed.data)
      res.status(201).json(ok(journey))
    } catch (err) {
      res.status(409).json(fail('JOURNEY_EXISTS', err instanceof Error ? err.message : 'Erro ao criar jornada'))
    }
  },

  /** POST /api/journey/:personaId/seed — cria jornada simulada (fallback IA) */
  createSeedJourney(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    try {
      const journey = JourneyService.createSeedJourney(profileId)
      res.status(201).json(ok(journey))
    } catch (err) {
      res.status(409).json(fail('JOURNEY_EXISTS', err instanceof Error ? err.message : 'Erro ao criar jornada'))
    }
  },

  /** POST /api/journey/:personaId/approve — aprova a jornada pendente */
  approveJourney(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const { journeyId } = req.body as { journeyId?: string }
    if (!journeyId) {
      res.status(400).json(fail('VALIDATION_ERROR', 'journeyId é obrigatório.'))
      return
    }
    try {
      const journey = JourneyService.approveJourney(profileId, journeyId)
      res.json(ok(journey))
    } catch (err) {
      res.status(400).json(fail('APPROVE_ERROR', err instanceof Error ? err.message : 'Erro ao aprovar'))
    }
  },

  /** POST /api/journey/:personaId/cancel — cancela a jornada */
  cancelJourney(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const { journeyId } = req.body as { journeyId?: string }
    if (!journeyId) {
      res.status(400).json(fail('VALIDATION_ERROR', 'journeyId é obrigatório.'))
      return
    }
    try {
      const journey = JourneyService.cancelJourney(profileId, journeyId)
      res.json(ok(journey))
    } catch (err) {
      res.status(400).json(fail('CANCEL_ERROR', err instanceof Error ? err.message : 'Erro ao cancelar'))
    }
  },

  /** POST /api/journey/missions/:missionId/complete — conclui uma missão */
  completeMission(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const missionId = String(req.params.missionId)
    try {
      const result = JourneyService.completeMission(profileId, missionId)
      res.json(ok(result))
    } catch (err) {
      res.status(400).json(fail('MISSION_ERROR', err instanceof Error ? err.message : 'Erro ao concluir missão'))
    }
  },

  /** PATCH /api/journey/:personaId/accumulated — atualiza valor acumulado */
  updateAccumulated(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    const schema = z.object({ journeyId: z.string(), amount: z.number().min(0) })
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json(fail('VALIDATION_ERROR', parsed.error.message))
      return
    }
    try {
      const journey = JourneyService.updateAccumulatedAmount(profileId, parsed.data.journeyId, parsed.data.amount)
      res.json(ok(journey))
    } catch (err) {
      res.status(400).json(fail('UPDATE_ERROR', err instanceof Error ? err.message : 'Erro ao atualizar'))
    }
  },

  /** GET /api/journey/:personaId/xp-history */
  getXpHistory(req: Request, res: Response): void {
    const profileId = req.params.personaId as PersonaId
    res.json(ok(JourneyService.getXpHistory(profileId)))
  },
}
