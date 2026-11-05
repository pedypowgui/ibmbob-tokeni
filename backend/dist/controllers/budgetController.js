"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const budgetService_1 = require("../services/budgetService");
const models_1 = require("../models");
exports.BudgetController = {
    getBudget(req, res) {
        const budget = budgetService_1.BudgetService.getBudget(req.params.personaId);
        res.json((0, models_1.ok)(budget));
    },
};
