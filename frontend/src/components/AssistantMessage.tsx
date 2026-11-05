import { Bot } from 'lucide-react'

interface AssistantMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export function AssistantMessage({ role, content, timestamp }: AssistantMessageProps) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--color-ai-light)] flex items-center justify-center mr-2 flex-shrink-0 self-end">
          <Bot size={16} className="text-[var(--color-ai)]" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--color-primary)] text-white rounded-br-sm'
            : 'bg-white border border-[var(--color-border)] text-[var(--color-text)] rounded-bl-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-green-200' : 'text-[var(--color-muted)]'}`}>
          {new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
