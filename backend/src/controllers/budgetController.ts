import type { Request, Response } from 'express'
import { BudgetService } from '../services/budgetService'
import { ok } from '../models'
import type { PersonaId } from '../models'

export const BudgetController = {
  getBudget(req: Request, res: Response): void {
    const budget = BudgetService.getBudget(req.params.personaId as PersonaId)
    res.json(ok(budget))
  },
}
