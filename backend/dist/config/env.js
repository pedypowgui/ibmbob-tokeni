"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: Number(process.env.PORT) || 3001,
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    AI_PROVIDER: (process.env.AI_PROVIDER ?? 'mock'),
    AI_API_KEY: process.env.AI_API_KEY ?? '',
    AI_MODEL: process.env.AI_MODEL ?? 'gpt-4o-mini',
    AI_BASE_URL: process.env.AI_BASE_URL ?? '',
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
};
