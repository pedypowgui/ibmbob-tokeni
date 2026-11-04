import type { Request, Response } from 'express'
import { GamificationService } from '../services/gamificationService'
import { ok, fail } from '../models'
import type { PersonaId } from '../models'

export const GamificationController = {
  getProfile(req: Request, res: Response): void {
    res.json(ok(GamificationService.getProfile(req.params.personaId as PersonaId)))
  },

  completeMission(req: Request, res: Response): void {
    const profile = GamificationService.completeMission(
      String(req.params.personaId) as PersonaId,
      String(req.params.missionId),
    )
    if (!profile) {
      res.status(400).json(fail('MISSION_ERROR', 'Missão não encontrada ou já concluída'))
      return
    }
    res.json(ok(profile))
  },
}
