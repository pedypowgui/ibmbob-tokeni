import { useState, useEffect } from 'react'
import type { PersonaId } from '../types'

const PERSONAS: Record<PersonaId, { name: string; avatar: string; role: string }> = {
  jose: { name: 'José Fá', avatar: '/jose-fa.jpg', role: 'Primeiro emprego' },
}

export interface ConnectedBank {
  id: string
  name: string
  icon: string
  connected: boolean
}

const DEFAULT_BANKS: ConnectedBank[] = [
  { id: 'nubank',    name: 'Nubank',          icon: '🟣', connected: false },
  { id: 'itau',     name: 'Itaú',             icon: '🟠', connected: false },
  { id: 'bradesco', name: 'Bradesco',          icon: '🔴', connected: false },
  { id: 'bb',       name: 'Banco do Brasil',  icon: '🟡', connected: false },
  { id: 'inter',    name: 'Banco Inter',       icon: '🟤', connected: false },
  { id: 'c6',       name: 'C6 Bank',           icon: '⚫', connected: false },
  { id: 'sicoob',   name: 'Sicoob',            icon: '🟢', connected: false },
]

function bankStorageKey(personaId: PersonaId) {
  return `tokeni_banks_${personaId}`
}

function nameStorageKey(personaId: PersonaId) {
  return `tokeni_name_${personaId}`
}

export function useProfile(personaId: PersonaId | null) {
  const defaults = personaId ? PERSONAS[personaId] : null

  const [displayName, setDisplayNameState] = useState<string>(() => {
    if (!personaId) return ''
    return localStorage.getItem(nameStorageKey(personaId)) ?? PERSONAS[personaId].name
  })

  const [banks, setBanksState] = useState<ConnectedBank[]>(() => {
    if (!personaId) return DEFAULT_BANKS
    try {
      const stored = localStorage.getItem(bankStorageKey(personaId))
      if (stored) return JSON.parse(stored) as ConnectedBank[]
    } catch { /* ignore */ }
    return DEFAULT_BANKS
  })

  // Re-sync when personaId changes
  useEffect(() => {
    if (!personaId) return
    setDisplayNameState(localStorage.getItem(nameStorageKey(personaId)) ?? PERSONAS[personaId].name)
    try {
      const stored = localStorage.getItem(bankStorageKey(personaId))
      setBanksState(stored ? JSON.parse(stored) : DEFAULT_BANKS)
    } catch {
      setBanksState(DEFAULT_BANKS)
    }
  }, [personaId])

  function saveName(name: string) {
    if (!personaId) return
    setDisplayNameState(name)
    localStorage.setItem(nameStorageKey(personaId), name)
  }

  function toggleBank(bankId: string) {
    if (!personaId) return
    setBanksState(prev => {
      const updated = prev.map(b => b.id === bankId ? { ...b, connected: !b.connected } : b)
      localStorage.setItem(bankStorageKey(personaId), JSON.stringify(updated))
      return updated
    })
  }

  return {
    displayName,
    avatar: defaults?.avatar ?? '👤',
    role: defaults?.role ?? '',
    banks,
    saveName,
    toggleBank,
  }
}
