import { Router } from 'express'
import { validatePersona } from '../middlewares/validatePersona'
import { PersonaController } from '../controllers/personaController'
import { DashboardController } from '../controllers/dashboardController'
import { TransactionController } from '../controllers/transactionController'
import { BudgetController } from '../controllers/budgetController'
import { GoalController } from '../controllers/goalController'
import { GamificationController } from '../controllers/gamificationController'
import { AssistantController } from '../controllers/assistantController'

const router = Router()

// ─── Personas ─────────────────────────────────────────────────────────────────
router.get('/personas', PersonaController.list)
router.get('/personas/:personaId', validatePersona, PersonaController.getById)

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard/:personaId', validatePersona, DashboardController.getSummary)

// ─── Transactions ─────────────────────────────────────────────────────────────
router.get('/transactions/:personaId', validatePersona, TransactionController.list)
router.get('/transactions/:personaId/:id', validatePersona, TransactionController.getById)

// ─── Budget ───────────────────────────────────────────────────────────────────
router.get('/budget/:personaId', validatePersona, BudgetController.getBudget)

// ─── Goals ────────────────────────────────────────────────────────────────────
router.get('/goals/:personaId', validatePersona, GoalController.list)
router.get('/goals/:personaId/:id', validatePersona, GoalController.getById)
router.post('/goals/:personaId', validatePersona, GoalController.create)
router.put('/goals/:personaId/:id', validatePersona, GoalController.update)

// ─── Gamification ─────────────────────────────────────────────────────────────
router.get('/gamification/:personaId', validatePersona, GamificationController.getProfile)
router.post(
  '/gamification/:personaId/missions/:missionId/complete',
  validatePersona,
  GamificationController.completeMission,
)

// ─── Assistant ────────────────────────────────────────────────────────────────
router.post('/assistant/chat', AssistantController.chat)

export default router
