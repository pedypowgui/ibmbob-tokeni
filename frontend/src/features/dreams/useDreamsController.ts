import { useState, useEffect, useCallback } from 'react'
import { usePersona } from '../../hooks/usePersona'
import type { JourneyState } from '../../types'
import {
  getJourney,
  createSeedJourney,
  approveJourney,
  cancelJourney,
  completeMission,
} from './journeyService'

export interface MissionCompletionResult {
  xpGained: number
  levelAdvanced: boolean
  journeyCompleted: boolean
}

export function useDreamsController() {
  const { personaId } = usePersona()
  const [state, setState] = useState<JourneyState | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!personaId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getJourney(personaId)
      setState(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sonhos')
    } finally {
      setLoading(false)
    }
  }, [personaId])

  useEffect(() => {
    load()
  }, [load])

  const handleCreateJourney = useCallback(async () => {
    if (!personaId) return
    setActionLoading(true)
    setError(null)
    try {
      await createSeedJourney(personaId)
      await load()
      setNotification('Jornada criada! Revise os níveis e aprove para começar.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar jornada')
    } finally {
      setActionLoading(false)
    }
  }, [personaId, load])

  const handleApproveJourney = useCallback(async (journeyId: string) => {
    if (!personaId) return
    setActionLoading(true)
    setError(null)
    try {
      await approveJourney(personaId, journeyId)
      await load()
      setNotification('Jornada aprovada! Sua aventura financeira começa agora. +50 XP 🎉')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar jornada')
    } finally {
      setActionLoading(false)
    }
  }, [personaId, load])

  const handleCancelJourney = useCallback(async (journeyId: string) => {
    if (!personaId) return
    setActionLoading(true)
    setError(null)
    try {
      await cancelJourney(personaId, journeyId)
      await load()
      setNotification('Jornada cancelada.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar jornada')
    } finally {
      setActionLoading(false)
    }
  }, [personaId, load])

  const handleCompleteMission = useCallback(
    async (missionId: string): Promise<MissionCompletionResult | null> => {
      if (!personaId) return null
      setActionLoading(true)
      setError(null)
      try {
        const result = await completeMission(personaId, missionId)
        await load()
        const msgs = [`+${result.xpGained} XP conquistados! 🌟`]
        if (result.levelAdvanced) msgs.push('Você avançou de nível! 🚀')
        if (result.journeyCompleted) msgs.push('Jornada concluída! Parabéns! 🏆')
        setNotification(msgs.join(' '))
        return result
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao concluir missão')
        return null
      } finally {
        setActionLoading(false)
      }
    },
    [personaId, load],
  )

  const dismissNotification = useCallback(() => setNotification(null), [])

  return {
    state,
    loading,
    actionLoading,
    error,
    notification,
    dismissNotification,
    handleCreateJourney,
    handleApproveJourney,
    handleCancelJourney,
    handleCompleteMission,
    reload: load,
  }
}
