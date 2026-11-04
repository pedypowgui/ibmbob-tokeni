import type { TransactionCategory } from '../types'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function formatMonth(iso: string): string {
  const [year, month] = iso.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })
}

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  food: 'Alimentação',
  transport: 'Transporte',
  health: 'Saúde',
  education: 'Educação',
  entertainment: 'Lazer',
  housing: 'Moradia',
  salary: 'Salário',
  other: 'Outros',
}

const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  food: '🍽️',
  transport: '🚌',
  health: '💊',
  education: '📚',
  entertainment: '🎮',
  housing: '🏠',
  salary: '💰',
  other: '📦',
}

export function categoryLabel(category: TransactionCategory): string {
  return CATEGORY_LABELS[category] ?? 'Outros'
}

export function categoryIcon(category: TransactionCategory): string {
  return CATEGORY_ICONS[category] ?? '📦'
}
