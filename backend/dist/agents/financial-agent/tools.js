"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentTools = void 0;
const dashboardService_1 = require("../../services/dashboardService");
const transactionService_1 = require("../../services/transactionService");
const budgetService_1 = require("../../services/budgetService");
const goalService_1 = require("../../services/goalService");
exports.agentTools = {
    getFinancialSummary(personaId) {
        const data = dashboardService_1.DashboardService.getSummary(personaId);
        return {
            toolName: 'getFinancialSummary',
            result: {
                income: data.income,
                totalExpenses: data.totalExpenses,
                balance: data.balance,
                alertCount: data.alerts.length,
            },
        };
    },
    getTransactions(personaId, category) {
        const data = transactionService_1.TransactionService.list(personaId, category ? { category } : undefined);
        return {
            toolName: 'getTransactions',
            result: data.slice(0, 10).map(t => ({
                description: t.description,
                amount: t.amount,
                category: t.category,
                date: t.date,
            })),
        };
    },
    getBudgetStatus(personaId) {
        const budget = budgetService_1.BudgetService.getBudget(personaId);
        return {
            toolName: 'getBudgetStatus',
            result: {
                income: budget.income,
                totalSpent: budget.totalSpent,
                balance: budget.balance,
                overLimitCategories: budget.categories
                    .filter(c => c.isOverLimit)
                    .map(c => ({ label: c.label, used: c.used, limit: c.limit })),
            },
        };
    },
    getGoalProgress(personaId) {
        const goals = goalService_1.GoalService.list(personaId);
        return {
            toolName: 'getGoalProgress',
            result: goals.map(g => ({
                title: g.title,
                progress: g.progress,
                remaining: g.targetAmount - g.currentAmount,
                deadline: g.deadline,
            })),
        };
    },
};
