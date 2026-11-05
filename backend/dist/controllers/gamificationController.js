"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationController = void 0;
const gamificationService_1 = require("../services/gamificationService");
const models_1 = require("../models");
exports.GamificationController = {
    getProfile(req, res) {
        res.json((0, models_1.ok)(gamificationService_1.GamificationService.getProfile(req.params.personaId)));
    },
    completeMission(req, res) {
        const profile = gamificationService_1.GamificationService.completeMission(String(req.params.personaId), String(req.params.missionId));
        if (!profile) {
            res.status(400).json((0, models_1.fail)('MISSION_ERROR', 'Missão não encontrada ou já concluída'));
            return;
        }
        res.json((0, models_1.ok)(profile));
    },
};
