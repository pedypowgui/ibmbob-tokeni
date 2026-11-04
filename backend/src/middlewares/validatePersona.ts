import type { Request, Response, NextFunction } from 'express'
import { fail } from '../models'

const VALID_PERSONAS = ['janaina', 'jose']

export function validatePersona(req: Request, res: Response, next: NextFunction): void {
  const personaId = String(req.params.personaId)
  if (!VALID_PERSONAS.includes(personaId)) {
    res.status(400).json(fail('INVALID_PERSONA', `Persona "${personaId}" não encontrada.`))
    return
  }
  next()
}
