import type { Transaction, ApiResponse } from '../../types'

const BASE = '/api'

export async function fetchTransactions(
  personaId: string,
  params?: { category?: string; from?: string; to?: string },
): Promise<Transaction[]> {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  const qs = query.toString() ? `?${query}` : ''
  const res = await fetch(`${BASE}/transactions/${personaId}${qs}`)
  const json: ApiResponse<Transaction[]> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar transações')
  return json.data!
}
