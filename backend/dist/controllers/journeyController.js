"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JourneyController = void 0;
const zod_1 = require("zod");
const models_1 = require("../models");
const journeyService_1 = require("../services/journeyService");
// ─── Schemas de validação ─────────────────────────────────────────────────────
const completionCriteriaSchema = zod_1.z.object({
    type: zod_1.z.string(),
    description: zod_1.z.string(),
    targetValue: zod_1.z.number().optional(),
    currentValue: zod_1.z.number().optional(),
});
const missionDefSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    rewardXp: zod_1.z.number().int().positive(),
    completionType: zod_1.z.enum(['automatic', 'manual', 'educational', 'financial']),
    completionCriteria: completionCriteriaSchema,
});
const levelDefSchema = zod_1.z.object({
    order: zod_1.z.number().int().positive(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    objective: zod_1.z.string().min(1),
    mainMission: missionDefSchema,
    secondaryMissions: zod_1.z.array(missionDefSchema).default([]),
});
const proposalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    targetAmount: zod_1.z.number().positive(),
    levels: zod_1.z.array(levelDefSchema).min(1),
});
// ─── Controller ───────────────────────────────────────────────────────────────
exports.JourneyController = {
    /** GET /api/journey/:personaId — retorna jornada ativa + progresso */
    getJourney(req, res) {
        const profileId = req.params.personaId;
        const journey = journeyService_1.JourneyService.getActiveJourney(profileId);
        const progress = journeyService_1.JourneyService.getUserProgress(profileId);
        res.json((0, models_1.ok)({ journey, progress }));
    },
    /** POST /api/journey/:personaId — cria jornada a partir de proposta */
    createJourney(req, res) {
        const profileId = req.params.personaId;
        const parsed = proposalSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', parsed.error.message));
            return;
        }
        try {
            const journey = journeyService_1.JourneyService.createJourneyFromProposal(profileId, parsed.data);
            res.status(201).json((0, models_1.ok)(journey));
        }
        catch (err) {
            res.status(409).json((0, models_1.fail)('JOURNEY_EXISTS', err instanceof Error ? err.message : 'Erro ao criar jornada'));
        }
    },
    /** POST /api/journey/:personaId/seed — cria jornada simulada (fallback IA) */
    createSeedJourney(req, res) {
        const profileId = req.params.personaId;
        try {
            const journey = journeyService_1.JourneyService.createSeedJourney(profileId);
            res.status(201).json((0, models_1.ok)(journey));
        }
        catch (err) {
            res.status(409).json((0, models_1.fail)('JOURNEY_EXISTS', err instanceof Error ? err.message : 'Erro ao criar jornada'));
        }
    },
    /** POST /api/journey/:personaId/approve — aprova a jornada pendente */
    approveJourney(req, res) {
        const profileId = req.params.personaId;
        const { journeyId } = req.body;
        if (!journeyId) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', 'journeyId é obrigatório.'));
            return;
        }
        try {
            const journey = journeyService_1.JourneyService.approveJourney(profileId, journeyId);
            res.json((0, models_1.ok)(journey));
        }
        catch (err) {
            res.status(400).json((0, models_1.fail)('APPROVE_ERROR', err instanceof Error ? err.message : 'Erro ao aprovar'));
        }
    },
    /** POST /api/journey/:personaId/cancel — cancela a jornada */
    cancelJourney(req, res) {
        const profileId = req.params.personaId;
        const { journeyId } = req.body;
        if (!journeyId) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', 'journeyId é obrigatório.'));
            return;
        }
        try {
            const journey = journeyService_1.JourneyService.cancelJourney(profileId, journeyId);
            res.json((0, models_1.ok)(journey));
        }
        catch (err) {
            res.status(400).json((0, models_1.fail)('CANCEL_ERROR', err instanceof Error ? err.message : 'Erro ao cancelar'));
        }
    },
    /** POST /api/journey/missions/:missionId/complete — conclui uma missão */
    completeMission(req, res) {
        const profileId = req.params.personaId;
        const missionId = String(req.params.missionId);
        try {
            const result = journeyService_1.JourneyService.completeMission(profileId, missionId);
            res.json((0, models_1.ok)(result));
        }
        catch (err) {
            res.status(400).json((0, models_1.fail)('MISSION_ERROR', err instanceof Error ? err.message : 'Erro ao concluir missão'));
        }
    },
    /** PATCH /api/journey/:personaId/accumulated — atualiza valor acumulado */
    updateAccumulated(req, res) {
        const profileId = req.params.personaId;
        const schema = zod_1.z.object({ journeyId: zod_1.z.string(), amount: zod_1.z.number().min(0) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', parsed.error.message));
            return;
        }
        try {
            const journey = journeyService_1.JourneyService.updateAccumulatedAmount(profileId, parsed.data.journeyId, parsed.data.amount);
            res.json((0, models_1.ok)(journey));
        }
        catch (err) {
            res.status(400).json((0, models_1.fail)('UPDATE_ERROR', err instanceof Error ? err.message : 'Erro ao atualizar'));
        }
    },
    /** GET /api/journey/:personaId/xp-history */
    getXpHistory(req, res) {
        const profileId = req.params.personaId;
        res.json((0, models_1.ok)(journeyService_1.JourneyService.getXpHistory(profileId)));
    },
};
