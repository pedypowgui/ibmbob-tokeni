import type { Request, Response } from 'express'
import { AssistantService } from '../services/assistantService'
import { ok, fail } from '../models'
import { z } from 'zod'

const chatSchema = z.object({
  personaId: z.enum(['jose']),
  message: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string(),
  })).default([]),
})

export const AssistantController = {
  async chat(req: Request, res: Response): Promise<void> {
    const result = chatSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json(fail('VALIDATION_ERROR', result.error.message))
      return
    }
    try {
      const response = await AssistantService.chat(
        result.data.personaId,
        result.data.message,
        result.data.history,
      )
      res.json(ok(response))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no assistente'
      res.status(503).json(fail('AI_ERROR', message))
    }
  },
}
