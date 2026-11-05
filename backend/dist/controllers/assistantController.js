"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantController = void 0;
const assistantService_1 = require("../services/assistantService");
const models_1 = require("../models");
const zod_1 = require("zod");
const chatSchema = zod_1.z.object({
    personaId: zod_1.z.enum(['janaina', 'jose']),
    message: zod_1.z.string().min(1).max(1000),
    history: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.enum(['user', 'assistant']),
        content: zod_1.z.string(),
        timestamp: zod_1.z.string(),
    })).default([]),
});
exports.AssistantController = {
    async chat(req, res) {
        const result = chatSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json((0, models_1.fail)('VALIDATION_ERROR', result.error.message));
            return;
        }
        try {
            const response = await assistantService_1.AssistantService.chat(result.data.personaId, result.data.message, result.data.history);
            res.json((0, models_1.ok)(response));
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Erro no assistente';
            res.status(503).json((0, models_1.fail)('AI_ERROR', message));
        }
    },
};
