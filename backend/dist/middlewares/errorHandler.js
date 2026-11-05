"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const models_1 = require("../models");
function errorHandler(err, _req, res, _next) {
    console.error('[Error]', err);
    const message = err instanceof Error ? err.message : 'Erro interno do servidor';
    res.status(500).json((0, models_1.fail)('INTERNAL_ERROR', message));
}
