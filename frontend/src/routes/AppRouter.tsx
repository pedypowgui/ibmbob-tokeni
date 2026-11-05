import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardView } from '../features/dashboard/DashboardView'
import { TransactionsView } from '../features/transactions/TransactionsView'
import { BudgetView } from '../features/budget/BudgetView'
import { GoalsView } from '../features/goals/GoalsView'
import { DreamsView } from '../features/dreams/DreamsView'
import { AssistantView } from '../features/assistant/AssistantView'
import { PersonaSelectView } from '../features/persona/PersonaSelectView'
import { usePersona } from '../hooks/usePersona'

function ProtectedLayout() {
  const { personaId } = usePersona()
  if (!personaId) return <Navigate to="/" replace />
  return <AppLayout />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PersonaSelectView />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/budget" element={<BudgetView />} />
          <Route path="/goals" element={<GoalsView />} />
          <Route path="/dreams" element={<DreamsView />} />
          <Route path="/assistant" element={<AssistantView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
