import { useState, useEffect, useCallback } from 'react'
import { usePersona } from '../../hooks/usePersona'
import { fetchTransactions } from './transactionService'
import type { Transaction, TransactionCategory } from '../../types'

export function useTransactionsController() {
  const { personaId } = usePersona()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | ''>('')

  const load = useCallback(async (category?: TransactionCategory | '') => {
    if (!personaId) return
    setLoading(true)
    try {
      const data = await fetchTransactions(personaId, category ? { category } : undefined)
      setTransactions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }, [personaId])

  useEffect(() => { load(categoryFilter) }, [load, categoryFilter])

  return { transactions, loading, error, categoryFilter, setCategoryFilter }
}
