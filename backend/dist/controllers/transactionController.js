"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transactionService_1 = require("../services/transactionService");
const models_1 = require("../models");
exports.TransactionController = {
    list(req, res) {
        const personaId = String(req.params.personaId);
        const { category, from, to } = req.query;
        const transactions = transactionService_1.TransactionService.list(personaId, { category, from, to });
        res.json((0, models_1.ok)(transactions));
    },
    getById(req, res) {
        const personaId = String(req.params.personaId);
        const id = String(req.params.id);
        const tx = transactionService_1.TransactionService.getById(personaId, id);
        if (!tx) {
            res.status(404).json((0, models_1.fail)('NOT_FOUND', 'Transação não encontrada'));
            return;
        }
        res.json((0, models_1.ok)(tx));
    },
};
