import type { Request, Response } from 'express'
import { UserRepository } from '../repositories'
import { ok, fail } from '../models'
import type { PersonaId } from '../models'

export const PersonaController = {
  list(_req: Request, res: Response): void {
    const users = UserRepository.findAll()
    res.json(ok(users))
  },

  getById(req: Request, res: Response): void {
    const user = UserRepository.findById(req.params.personaId as PersonaId)
    if (!user) {
      res.status(404).json(fail('NOT_FOUND', 'Persona não encontrada'))
      return
    }
    res.json(ok(user))
  },
}
