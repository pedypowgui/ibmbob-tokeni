"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssistantService = void 0;
const agent_1 = require("../agents/financial-agent/agent");
const modelProvider_1 = require("../agents/providers/modelProvider");
const provider = (0, modelProvider_1.createProvider)();
exports.AssistantService = {
    async chat(personaId, message, history) {
        return (0, agent_1.runAgent)(personaId, message, history, provider);
    },
};
