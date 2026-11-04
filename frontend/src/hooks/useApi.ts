import { useState, useCallback } from 'react'
import type { ApiResponse } from '../types'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const request = useCallback(async (
    url: string,
    options?: RequestInit,
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      })
      const json: ApiResponse<T> = await res.json()
      if (!res.ok || json.error) {
        throw new Error(json.error?.message || 'Erro na requisição')
      }
      setState({ data: json.data, loading: false, error: null })
      return json.data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setState({ data: null, loading: false, error: message })
      return null
    }
  }, [])

  return { ...state, request }
}
