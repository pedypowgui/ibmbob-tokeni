import type { DashboardSummary, ApiResponse } from '../../types'

const BASE = '/api'

export async function fetchDashboard(personaId: string): Promise<DashboardSummary> {
  const res = await fetch(`${BASE}/dashboard/${personaId}`)
  const json: ApiResponse<DashboardSummary> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar dashboard')
  return json.data!
}
