import type { PersonaId } from '../../models'
import { buildContext } from './context'
import { buildSystemPrompt } from './prompt'
import type { AIMessage, AIProvider } from '../providers/aiProvider'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface AgentResponse {
  reply: string
  toolsUsed: string[]
}

export async function runAgent(
  personaId: PersonaId,
  userMessage: string,
  history: ChatMessage[],
  provider: AIProvider,
): Promise<AgentResponse> {
  const context = buildContext(personaId)
  const systemPrompt = buildSystemPrompt(context)

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const response = await provider.chat(messages)

  return {
    reply: response.reply,
    toolsUsed: [],
  }
}
