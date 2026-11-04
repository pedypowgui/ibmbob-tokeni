import type { FinancialGoal, ApiResponse } from '../../types'

const BASE = '/api'

export async function fetchGoals(personaId: string): Promise<FinancialGoal[]> {
  const res = await fetch(`${BASE}/goals/${personaId}`)
  const json: ApiResponse<FinancialGoal[]> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar sonhos')
  return json.data!
}

export async function createGoal(
  personaId: string,
  payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>,
): Promise<FinancialGoal> {
  const res = await fetch(`${BASE}/goals/${personaId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json: ApiResponse<FinancialGoal> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao criar sonho')
  return json.data!
}
