export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  reply: string
  model: string
}

export interface AIProvider {
  chat(messages: AIMessage[]): Promise<AIResponse>
}
