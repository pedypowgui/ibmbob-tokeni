import type { ReactElement } from 'react'
import {
  UtensilsCrossed, Bus, Pill, BookOpen, Gamepad2,
  Home, Banknote, Package,
} from 'lucide-react'
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

const CATEGORY_ICON_MAP: Record<TransactionCategory, ReactElement> = {
  food:          <UtensilsCrossed size={18} />,
  transport:     <Bus size={18} />,
  health:        <Pill size={18} />,
  education:     <BookOpen size={18} />,
  entertainment: <Gamepad2 size={18} />,
  housing:       <Home size={18} />,
  salary:        <Banknote size={18} />,
  other:         <Package size={18} />,
}

export function categoryLabel(category: TransactionCategory): string {
  return CATEGORY_LABELS[category] ?? 'Outros'
}

export function categoryIcon(category: TransactionCategory): ReactElement {
  return CATEGORY_ICON_MAP[category] ?? <Package size={18} />
}
