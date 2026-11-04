import type { ChatMessage, ApiResponse } from '../../types'

const BASE = '/api'

export async function sendMessage(
  personaId: string,
  message: string,
  history: ChatMessage[],
): Promise<{ reply: string; toolsUsed: string[] }> {
  const res = await fetch(`${BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ personaId, message, history }),
  })
  const json: ApiResponse<{ reply: string; toolsUsed: string[] }> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro no assistente')
  return json.data!
}
