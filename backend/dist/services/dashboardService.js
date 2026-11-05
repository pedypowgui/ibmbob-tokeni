"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const repositories_1 = require("../repositories");
const budgetService_1 = require("./budgetService");
exports.DashboardService = {
    getSummary(personaId) {
        const month = '2025-07';
        const transactions = repositories_1.TransactionRepository.findByPersona(personaId)
            .filter(t => t.date.startsWith(month));
        const income = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
        const balance = income - totalExpenses;
        const budget = budgetService_1.BudgetService.getBudget(personaId);
        const alerts = budget.categories
            .filter(c => c.isOverLimit)
            .map(c => ({
            id: `alert-${c.category}`,
            type: 'over_budget',
            message: `Você ultrapassou o limite de ${c.label} este mês.`,
            category: c.category,
        }));
        const recentTransactions = [...transactions]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 5);
        return { personaId, month, income, totalExpenses, balance, alerts, recentTransactions };
    },
};
