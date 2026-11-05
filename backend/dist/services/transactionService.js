"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
exports.categoryLabel = categoryLabel;
const repositories_1 = require("../repositories");
const CATEGORY_LABELS = {
    food: 'Alimentação', transport: 'Transporte', health: 'Saúde',
    education: 'Educação', entertainment: 'Lazer', housing: 'Moradia',
    salary: 'Salário', other: 'Outros',
};
function categoryLabel(cat) {
    return CATEGORY_LABELS[cat] ?? 'Outros';
}
exports.TransactionService = {
    list(personaId, filters) {
        let txs = repositories_1.TransactionRepository.findByPersona(personaId);
        if (filters?.category) {
            txs = txs.filter(t => t.category === filters.category);
        }
        if (filters?.from) {
            txs = txs.filter(t => t.date >= filters.from);
        }
        if (filters?.to) {
            txs = txs.filter(t => t.date <= filters.to);
        }
        return txs.sort((a, b) => b.date.localeCompare(a.date));
    },
    getById(personaId, id) {
        return repositories_1.TransactionRepository.findById(personaId, id);
    },
};
