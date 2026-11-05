"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const goalService_1 = require("../services/goalService");
const models_1 = require("../models");
const zod_1 = require("zod");
const createSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    emoji: zod_1.z.string().default('🎯'),
    targetAmount: zod_1.z.number().positive(),
    currentAmount: zod_1.z.number().min(0).default(0),
    deadline: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
exports.GoalController = {
    list(req, res) {
        res.json((0, models_1.ok)(goalService_1.GoalService.list(req.params.personaId)));
    },
    getById(req, res) {
        const goal = goalService_1.GoalService.getById(String(req.params.personaId), String(req.params.id));
        if (!goal) {
            res.status(404).json((0, models_1.fail)('NOT_FOUND', 'Objetivo não encontrado'));
            return;
        }
        res.json((0, models_1.ok)(goal));
    },
    create(req, res) {
        const result = createSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', result.error.message));
            return;
        }
        const goal = goalService_1.GoalService.create(req.params.personaId, result.data);
        res.status(201).json((0, models_1.ok)(goal));
    },
    update(req, res) {
        const goal = goalService_1.GoalService.update(String(req.params.personaId), String(req.params.id), req.body);
        if (!goal) {
            res.status(404).json((0, models_1.fail)('NOT_FOUND', 'Objetivo não encontrado'));
            return;
        }
        res.json((0, models_1.ok)(goal));
    },
};
