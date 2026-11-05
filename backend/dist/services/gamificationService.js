"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const repositories_1 = require("../repositories");
exports.GamificationService = {
    getProfile(personaId) {
        return repositories_1.GamificationRepository.findByPersona(personaId);
    },
    completeMission(personaId, missionId) {
        const success = repositories_1.GamificationRepository.completeMission(personaId, missionId);
        if (!success)
            return null;
        return repositories_1.GamificationRepository.findByPersona(personaId);
    },
};
