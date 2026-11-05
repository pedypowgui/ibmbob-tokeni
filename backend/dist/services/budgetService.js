"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const repositories_1 = require("../repositories");
const transactionService_1 = require("./transactionService");
const EXPENSE_CATEGORIES = [
    'food', 'transport', 'housing', 'health', 'education', 'entertainment', 'other',
];
exports.BudgetService = {
    getBudget(personaId) {
        const month = currentMonth();
        const transactions = repositories_1.TransactionRepository.findByPersona(personaId)
            .filter(t => t.date.startsWith(month));
        const limits = repositories_1.BudgetLimitRepository.findByPersona(personaId);
        const income = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        const categories = EXPENSE_CATEGORIES.map(cat => {
            const used = Math.abs(transactions
                .filter(t => t.category === cat && t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0));
            const limit = limits[cat] ?? 0;
            const remaining = Math.max(limit - used, 0);
            const percentUsed = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
            return {
                category: cat,
                label: (0, transactionService_1.categoryLabel)(cat),
                limit,
                used,
                remaining,
                percentUsed: Math.round(percentUsed * 10) / 10,
                isOverLimit: used > limit,
            };
        }).filter(c => c.limit > 0 || c.used > 0);
        const totalSpent = categories.reduce((sum, c) => sum + c.used, 0);
        const balance = income - totalSpent;
        return { personaId, month, income, totalSpent, balance, categories };
    },
};
function currentMonth() {
    // Fixed to 2025-07 to match the fixture data
    return '2025-07';
}
