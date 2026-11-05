"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildContext = buildContext;
const dashboardService_1 = require("../../services/dashboardService");
const budgetService_1 = require("../../services/budgetService");
const goalService_1 = require("../../services/goalService");
const journeyService_1 = require("../../services/journeyService");
const journeyRepository_1 = require("../../repositories/journeyRepository");
function buildContext(personaId) {
    const summary = dashboardService_1.DashboardService.getSummary(personaId);
    const budget = budgetService_1.BudgetService.getBudget(personaId);
    const goals = goalService_1.GoalService.list(personaId);
    const personaName = personaId === 'jose' ? 'José Fá' : 'Janaína Brito';
    const overBudgetCategories = budget.categories
        .filter(c => c.isOverLimit)
        .map(c => c.label);
    const recentExpenses = summary.recentTransactions
        .filter(t => t.amount < 0)
        .slice(0, 5)
        .map(t => ({
        description: t.description,
        amount: Math.abs(t.amount),
        category: t.category,
    }));
    const activeJourney = journeyService_1.JourneyService.getActiveJourney(personaId);
    const userProgress = journeyRepository_1.UserProgressRepository.find(personaId);
    return {
        personaId,
        personaName,
        income: summary.income,
        balance: summary.balance,
        totalExpenses: summary.totalExpenses,
        overBudgetCategories,
        recentExpenses,
        goals: goals.map(g => ({
            title: g.title,
            progress: g.progress,
            targetAmount: g.targetAmount,
        })),
        hasActiveJourney: activeJourney !== null,
        journeyTitle: activeJourney?.title ?? '',
        journeyProgress: activeJourney?.journeyProgress ?? 0,
        financialProgress: activeJourney?.financialProgress ?? 0,
        totalXp: userProgress.totalXp,
    };
}
