"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalService = void 0;
const nanoid_1 = require("nanoid");
const repositories_1 = require("../repositories");
exports.GoalService = {
    list(personaId) {
        return repositories_1.GoalRepository.findByPersona(personaId);
    },
    getById(personaId, id) {
        return repositories_1.GoalRepository.findById(personaId, id);
    },
    create(personaId, payload) {
        const progress = payload.targetAmount > 0
            ? Math.min((payload.currentAmount / payload.targetAmount) * 100, 100)
            : 0;
        const goal = {
            id: (0, nanoid_1.nanoid)(8),
            personaId,
            ...payload,
            progress: Math.round(progress * 100) / 100,
        };
        return repositories_1.GoalRepository.save(personaId, goal);
    },
    update(personaId, id, patch) {
        const existing = repositories_1.GoalRepository.findById(personaId, id);
        if (!existing)
            return null;
        const updated = { ...existing, ...patch };
        updated.progress = updated.targetAmount > 0
            ? Math.min((updated.currentAmount / updated.targetAmount) * 100, 100)
            : 0;
        updated.progress = Math.round(updated.progress * 100) / 100;
        return repositories_1.GoalRepository.save(personaId, updated);
    },
};
