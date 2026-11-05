"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaController = void 0;
const repositories_1 = require("../repositories");
const models_1 = require("../models");
exports.PersonaController = {
    list(_req, res) {
        const users = repositories_1.UserRepository.findAll();
        res.json((0, models_1.ok)(users));
    },
    getById(req, res) {
        const user = repositories_1.UserRepository.findById(req.params.personaId);
        if (!user) {
            res.status(404).json((0, models_1.fail)('NOT_FOUND', 'Persona não encontrada'));
            return;
        }
        res.json((0, models_1.ok)(user));
    },
};
