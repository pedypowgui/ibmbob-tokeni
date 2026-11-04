import { useState, useEffect, useCallback } from 'react'
import { usePersona } from '../../hooks/usePersona'
import { fetchGoals, createGoal } from './goalService'
import type { FinancialGoal } from '../../types'

export function useGoalsController() {
  const { personaId } = usePersona()
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!personaId) return
    setLoading(true)
    try {
      setGoals(await fetchGoals(personaId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [personaId])

  useEffect(() => { load() }, [load])

  async function addGoal(payload: Omit<FinancialGoal, 'id' | 'personaId' | 'progress'>) {
    if (!personaId) return
    try {
      const goal = await createGoal(personaId, payload)
      setGoals(prev => [...prev, goal])
      setShowForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar')
    }
  }

  return { goals, loading, error, showForm, setShowForm, addGoal }
}
