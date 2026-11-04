import type { Request, Response } from 'express'
import { TransactionService } from '../services/transactionService'
import { ok, fail } from '../models'
import type { PersonaId } from '../models'

export const TransactionController = {
  list(req: Request, res: Response): void {
    const personaId = String(req.params.personaId)
    const { category, from, to } = req.query as Record<string, string>
    const transactions = TransactionService.list(personaId as PersonaId, { category, from, to })
    res.json(ok(transactions))
  },

  getById(req: Request, res: Response): void {
    const personaId = String(req.params.personaId)
    const id = String(req.params.id)
    const tx = TransactionService.getById(personaId as PersonaId, id)
    if (!tx) {
      res.status(404).json(fail('NOT_FOUND', 'Transação não encontrada'))
      return
    }
    res.json(ok(tx))
  },
}
