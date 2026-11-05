"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json());
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes_1.default);
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
// ─── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`[Tokeni API] Running on http://localhost:${env_1.env.PORT}`);
    console.log(`[Tokeni API] AI provider: ${env_1.env.AI_PROVIDER}`);
});
exports.default = app;
