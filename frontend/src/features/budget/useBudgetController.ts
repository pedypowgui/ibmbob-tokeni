import { useState, useEffect } from 'react'
import { usePersona } from '../../hooks/usePersona'
import { fetchBudget } from './budgetService'
import type { Budget } from '../../types'

export function useBudgetController() {
  const { personaId } = usePersona()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!personaId) return
    setLoading(true)
    fetchBudget(personaId)
      .then(setBudget)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [personaId])

  return { budget, loading, error }
}
