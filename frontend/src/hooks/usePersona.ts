import { useState, useEffect } from 'react'
import type { PersonaId } from '../types'

const STORAGE_KEY = 'tokeni_persona'

export function usePersona() {
  const [personaId, setPersonaIdState] = useState<PersonaId | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored as PersonaId) || null
  })

  useEffect(() => {
    if (personaId) {
      localStorage.setItem(STORAGE_KEY, personaId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [personaId])

  function setPersona(id: PersonaId) {
    setPersonaIdState(id)
  }

  function clearPersona() {
    setPersonaIdState(null)
  }

  return { personaId, setPersona, clearPersona }
}
