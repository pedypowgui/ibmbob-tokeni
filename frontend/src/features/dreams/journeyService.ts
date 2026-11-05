import type {
  ApiResponse,
  JourneyState,
  Journey,
  XPHistory,
} from '../../types'

const BASE = '/api'

export async function getJourney(personaId: string): Promise<JourneyState> {
  const res = await fetch(`${BASE}/journey/${personaId}`)
  const json: ApiResponse<JourneyState> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar jornada')
  return json.data!
}

export async function createSeedJourney(personaId: string): Promise<Journey> {
  const res = await fetch(`${BASE}/journey/${personaId}/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  const json: ApiResponse<Journey> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao criar jornada')
  return json.data!
}

export async function approveJourney(personaId: string, journeyId: string): Promise<Journey> {
  const res = await fetch(`${BASE}/journey/${personaId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ journeyId }),
  })
  const json: ApiResponse<Journey> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao aprovar jornada')
  return json.data!
}

export async function cancelJourney(personaId: string, journeyId: string): Promise<Journey> {
  const res = await fetch(`${BASE}/journey/${personaId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ journeyId }),
  })
  const json: ApiResponse<Journey> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao cancelar jornada')
  return json.data!
}

export async function completeMission(
  personaId: string,
  missionId: string,
): Promise<{ xpGained: number; levelAdvanced: boolean; journeyCompleted: boolean }> {
  const res = await fetch(`${BASE}/journey/${personaId}/missions/${missionId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  const json: ApiResponse<{ xpGained: number; levelAdvanced: boolean; journeyCompleted: boolean }> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao concluir missão')
  return json.data!
}

export async function updateAccumulated(
  personaId: string,
  journeyId: string,
  amount: number,
): Promise<Journey> {
  const res = await fetch(`${BASE}/journey/${personaId}/accumulated`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ journeyId, amount }),
  })
  const json: ApiResponse<Journey> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao atualizar valor')
  return json.data!
}

export async function getXpHistory(personaId: string): Promise<XPHistory[]> {
  const res = await fetch(`${BASE}/journey/${personaId}/xp-history`)
  const json: ApiResponse<XPHistory[]> = await res.json()
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Erro ao carregar histórico')
  return json.data!
}
