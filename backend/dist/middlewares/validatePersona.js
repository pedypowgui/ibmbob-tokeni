"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePersona = validatePersona;
const models_1 = require("../models");
const VALID_PERSONAS = ['janaina', 'jose'];
function validatePersona(req, res, next) {
    const personaId = String(req.params.personaId);
    if (!VALID_PERSONAS.includes(personaId)) {
        res.status(400).json((0, models_1.fail)('INVALID_PERSONA', `Persona "${personaId}" não encontrada.`));
        return;
    }
    next();
}
