import type { PersonaId } from '../models'
import type { ChatMessage } from '../agents/financial-agent/agent'
import { runAgent } from '../agents/financial-agent/agent'
import { createProvider } from '../agents/providers/modelProvider'

const provider = createProvider()

export const AssistantService = {
  async chat(
    personaId: PersonaId,
    message: string,
    history: ChatMessage[],
  ) {
    return runAgent(personaId, message, history, provider)
  },
}
