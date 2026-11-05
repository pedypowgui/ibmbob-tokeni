"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAgent = runAgent;
const context_1 = require("./context");
const prompt_1 = require("./prompt");
async function runAgent(personaId, userMessage, history, provider) {
    const context = (0, context_1.buildContext)(personaId);
    const systemPrompt = (0, prompt_1.buildSystemPrompt)(context);
    const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
    ];
    const response = await provider.chat(messages);
    return {
        reply: response.reply,
        toolsUsed: [],
    };
}
