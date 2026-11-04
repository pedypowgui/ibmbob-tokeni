import type {
  PersonaId, Transaction, TransactionCategory,
} from '../models'
import { TransactionRepository } from '../repositories'

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: 'Alimentação', transport: 'Transporte', health: 'Saúde',
  education: 'Educação', entertainment: 'Lazer', housing: 'Moradia',
  salary: 'Salário', other: 'Outros',
}

export function categoryLabel(cat: TransactionCategory): string {
  return CATEGORY_LABELS[cat] ?? 'Outros'
}

export const TransactionService = {
  list(
    personaId: PersonaId,
    filters?: { category?: string; from?: string; to?: string },
  ): Transaction[] {
    let txs = TransactionRepository.findByPersona(personaId)
    if (filters?.category) {
      txs = txs.filter(t => t.category === filters.category)
    }
    if (filters?.from) {
      txs = txs.filter(t => t.date >= filters.from!)
    }
    if (filters?.to) {
      txs = txs.filter(t => t.date <= filters.to!)
    }
    return txs.sort((a, b) => b.date.localeCompare(a.date))
  },

  getById(personaId: PersonaId, id: string): Transaction | null {
    return TransactionRepository.findById(personaId, id)
  },
}
