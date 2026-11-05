"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validatePersona_1 = require("../middlewares/validatePersona");
const personaController_1 = require("../controllers/personaController");
const dashboardController_1 = require("../controllers/dashboardController");
const transactionController_1 = require("../controllers/transactionController");
const budgetController_1 = require("../controllers/budgetController");
const goalController_1 = require("../controllers/goalController");
const gamificationController_1 = require("../controllers/gamificationController");
const assistantController_1 = require("../controllers/assistantController");
const journeyController_1 = require("../controllers/journeyController");
const router = (0, express_1.Router)();
// ─── Personas ─────────────────────────────────────────────────────────────────
router.get('/personas', personaController_1.PersonaController.list);
router.get('/personas/:personaId', validatePersona_1.validatePersona, personaController_1.PersonaController.getById);
// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard/:personaId', validatePersona_1.validatePersona, dashboardController_1.DashboardController.getSummary);
// ─── Transactions ─────────────────────────────────────────────────────────────
router.get('/transactions/:personaId', validatePersona_1.validatePersona, transactionController_1.TransactionController.list);
router.get('/transactions/:personaId/:id', validatePersona_1.validatePersona, transactionController_1.TransactionController.getById);
// ─── Budget ───────────────────────────────────────────────────────────────────
router.get('/budget/:personaId', validatePersona_1.validatePersona, budgetController_1.BudgetController.getBudget);
// ─── Goals ────────────────────────────────────────────────────────────────────
router.get('/goals/:personaId', validatePersona_1.validatePersona, goalController_1.GoalController.list);
router.get('/goals/:personaId/:id', validatePersona_1.validatePersona, goalController_1.GoalController.getById);
router.post('/goals/:personaId', validatePersona_1.validatePersona, goalController_1.GoalController.create);
router.put('/goals/:personaId/:id', validatePersona_1.validatePersona, goalController_1.GoalController.update);
// ─── Gamification ─────────────────────────────────────────────────────────────
router.get('/gamification/:personaId', validatePersona_1.validatePersona, gamificationController_1.GamificationController.getProfile);
router.post('/gamification/:personaId/missions/:missionId/complete', validatePersona_1.validatePersona, gamificationController_1.GamificationController.completeMission);
// ─── Jornadas / Sonhos ────────────────────────────────────────────────────────
router.get('/journey/:personaId', validatePersona_1.validatePersona, journeyController_1.JourneyController.getJourney);
router.post('/journey/:personaId', validatePersona_1.validatePersona, journeyController_1.JourneyController.createJourney);
router.post('/journey/:personaId/seed', validatePersona_1.validatePersona, journeyController_1.JourneyController.createSeedJourney);
router.post('/journey/:personaId/approve', validatePersona_1.validatePersona, journeyController_1.JourneyController.approveJourney);
router.post('/journey/:personaId/cancel', validatePersona_1.validatePersona, journeyController_1.JourneyController.cancelJourney);
router.post('/journey/:personaId/missions/:missionId/complete', validatePersona_1.validatePersona, journeyController_1.JourneyController.completeMission);
router.patch('/journey/:personaId/accumulated', validatePersona_1.validatePersona, journeyController_1.JourneyController.updateAccumulated);
router.get('/journey/:personaId/xp-history', validatePersona_1.validatePersona, journeyController_1.JourneyController.getXpHistory);
// ─── Assistant ────────────────────────────────────────────────────────────────
router.post('/assistant/chat', assistantController_1.AssistantController.chat);
exports.default = router;
