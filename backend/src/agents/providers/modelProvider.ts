import type { AIProvider, AIMessage, AIResponse } from './aiProvider'
import { env } from '../../config/env'

// ─── Mock Provider (no external API required) ────────────────────────────────

class MockProvider implements AIProvider {
  async chat(messages: AIMessage[]): Promise<AIResponse> {
    const userMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
    const systemMsg = messages.find(m => m.role === 'system')?.content ?? ''

    // Extract key values from system prompt for contextual mock responses
    const incomeMatch = systemMsg.match(/Renda mensal: R\$([\d,.]+)/)
    const balanceMatch = systemMsg.match(/Saldo disponível: R\$([\d,.]+)/)
    const income = incomeMatch?.[1] ?? '?'
    const balance = balanceMatch?.[1] ?? '?'

    const lower = userMsg.toLowerCase()
    let reply = ''

    if (lower.includes('orçamento') || lower.includes('orcamento') || lower.includes('gast')) {
      reply = `Analisando seu orçamento deste mês: sua renda é de R$${income} e seu saldo atual é R$${balance}. Verifique as categorias que aparecem em vermelho no painel — elas indicam gastos acima do limite. Tente cortar gastos supérfluos nas categorias em alerta para recuperar o equilíbrio.`
    } else if (lower.includes('economiz') || lower.includes('poupar') || lower.includes('poupan')) {
      reply = `Ótima iniciativa pensar em economizar! Com renda de R$${income} e saldo de R$${balance}, você pode começar separando pelo menos 10% da renda logo no início do mês antes de gastar. Automatize esse processo para que vire hábito.`
    } else if (lower.includes('sonho') || lower.includes('objetivo') || lower.includes('meta')) {
      reply = `Seus objetivos financeiros estão na aba "Sonhos". Cada sonho mostra o progresso atual em relação à meta. Para acelerar o progresso, tente aportar ao menos um valor fixo mensal a cada objetivo. Pequenos depósitos regulares fazem grande diferença no longo prazo!`
    } else if (lower.includes('dívid') || lower.includes('divid') || lower.includes('devo')) {
      reply = `Dívidas devem ser a prioridade número um. Se você tem dívidas com juros altos, pague-as antes de qualquer investimento. Organize-as da maior taxa de juros para a menor e foque no topo da lista.`
    } else {
      reply = `Olá! Estou aqui para ajudar você a entender suas finanças. Seu saldo atual é R$${balance}. Você pode me perguntar sobre seu orçamento, como economizar, seus objetivos financeiros ou qualquer dúvida sobre seus gastos. Como posso ajudar?`
    }

    return { reply, model: 'mock-v1' }
  }
}

// ─── OpenAI-compatible Provider ───────────────────────────────────────────────

class OpenAIProvider implements AIProvider {
  private apiKey: string
  private baseUrl: string
  private model: string

  constructor(apiKey: string, baseUrl: string, model: string) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl || 'https://api.openai.com'
    this.model = model
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: this.model, messages, max_tokens: 512, temperature: 0.7 }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`AI provider error: ${response.status} ${err}`)
    }

    const json = await response.json() as {
      choices: Array<{ message: { content: string } }>
      model: string
    }
    return {
      reply: json.choices[0].message.content,
      model: json.model,
    }
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createProvider(): AIProvider {
  switch (env.AI_PROVIDER) {
    case 'openai':
    case 'watsonx':
      if (!env.AI_API_KEY) {
        console.warn('[AI] AI_API_KEY not set, falling back to mock provider.')
        return new MockProvider()
      }
      return new OpenAIProvider(env.AI_API_KEY, env.AI_BASE_URL, env.AI_MODEL)
    default:
      return new MockProvider()
  }
}
