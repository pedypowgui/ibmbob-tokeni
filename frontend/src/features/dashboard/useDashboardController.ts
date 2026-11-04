import { useState, useEffect } from 'react'
import { usePersona } from '../../hooks/usePersona'
import { fetchDashboard } from './dashboardService'
import type { DashboardSummary } from '../../types'

export function useDashboardController() {
  const { personaId } = usePersona()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!personaId) return
    setLoading(true)
    fetchDashboard(personaId)
      .then(setSummary)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [personaId])

  return { summary, loading, error }
}
