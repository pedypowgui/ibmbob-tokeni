import type { Request, Response } from 'express'
import { DashboardService } from '../services/dashboardService'
import { ok } from '../models'
import type { PersonaId } from '../models'

export const DashboardController = {
  getSummary(req: Request, res: Response): void {
    const summary = DashboardService.getSummary(req.params.personaId as PersonaId)
    res.json(ok(summary))
  },
}
