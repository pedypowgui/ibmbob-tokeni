import { useState, useCallback } from 'react'
import { usePersona } from '../../hooks/usePersona'
import { sendMessage } from './assistantService'
import type { ChatMessage } from '../../types'

export function useAssistantController() {
  const { personaId } = usePersona()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = useCallback(async (text: string) => {
    if (!personaId || !text.trim()) return
    setError(null)

    const userMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const result = await sendMessage(personaId, text, messages)
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.reply,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [personaId, messages])

  function clearHistory() {
    setMessages([])
  }

  return { messages, loading, error, send, clearHistory }
}
