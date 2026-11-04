import type { Request, Response } from 'express'
import { GoalService } from '../services/goalService'
import { ok, fail } from '../models'
import type { PersonaId } from '../models'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1),
  emoji: z.string().default('🎯'),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export const GoalController = {
  list(req: Request, res: Response): void {
    res.json(ok(GoalService.list(req.params.personaId as PersonaId)))
  },

  getById(req: Request, res: Response): void {
    const goal = GoalService.getById(String(req.params.personaId) as PersonaId, String(req.params.id))
    if (!goal) {
      res.status(404).json(fail('NOT_FOUND', 'Objetivo não encontrado'))
      return
    }
    res.json(ok(goal))
  },

  create(req: Request, res: Response): void {
    const result = createSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json(fail('VALIDATION_ERROR', result.error.message))
      return
    }
    const goal = GoalService.create(req.params.personaId as PersonaId, result.data)
    res.status(201).json(ok(goal))
  },

  update(req: Request, res: Response): void {
    const goal = GoalService.update(
      String(req.params.personaId) as PersonaId,
      String(req.params.id),
      req.body,
    )
    if (!goal) {
      res.status(404).json(fail('NOT_FOUND', 'Objetivo não encontrado'))
      return
    }
    res.json(ok(goal))
  },
}
