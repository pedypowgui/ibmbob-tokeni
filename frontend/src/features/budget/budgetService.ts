import type { Budget, ApiResponse } from '../../types'

const BASE = '/api'

export async function fetchBudget(personaId: string): Promise<Budget> {
  const res = await fetch(`${BASE}/budget/${personaId}`)
  const json: ApiResponse<Budget> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar orçamento')
  return json.data!
}
