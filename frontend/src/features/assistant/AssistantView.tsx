import { useState, useRef, useEffect } from 'react'
import { Send, Trash2, Sparkles, Bot } from 'lucide-react'
import { useAssistantController } from './useAssistantController'
import { AssistantMessage } from '../../components/AssistantMessage'

const SUGGESTIONS = [
  'Como está meu orçamento este mês?',
  'Onde estou gastando mais?',
  'Me ajude a economizar mais.',
  'Quanto falta para meu objetivo?',
]

export function AssistantView() {
  const { messages, loading, error, send, clearHistory } = useAssistantController()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSend() {
    if (!input.trim()) return
    send(input)
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[calc(100dvh-var(--bottom-nav-height))] lg:h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-ai-light)] flex items-center justify-center">
            <Sparkles size={18} className="text-[var(--color-ai)]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--color-text)]">Assistente Tokeni</h1>
            <p className="text-[10px] text-[var(--color-ai)]">IA financeira pessoal</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearHistory} className="p-2 rounded-xl text-[var(--color-muted)] hover:text-[var(--color-danger)]">
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-ai-light)] flex items-center justify-center">
              <Bot size={32} className="text-[var(--color-ai)]" />
            </div>
            <p className="text-sm text-center text-[var(--color-muted)] max-w-[200px]">
              Olá! Sou seu assistente financeiro. Como posso ajudar?
            </p>
            <div className="grid grid-cols-1 gap-2 w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { send(s) }}
                  className="text-left text-xs px-4 py-2.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] hover:border-[var(--color-ai)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <AssistantMessage key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-[var(--color-border)] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-[var(--color-ai)] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-[var(--color-ai)] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-[var(--color-ai)] rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-center text-xs text-[var(--color-danger)] py-2">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre suas finanças…"
            rows={1}
            className="flex-1 resize-none border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-ai)] bg-white"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-50 flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
