import type { Request, Response, NextFunction } from 'express'
import { fail } from '../models'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[Error]', err)
  const message = err instanceof Error ? err.message : 'Erro interno do servidor'
  res.status(500).json(fail('INTERNAL_ERROR', message))
}
