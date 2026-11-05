"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
const models_1 = require("../models");
exports.DashboardController = {
    getSummary(req, res) {
        const summary = dashboardService_1.DashboardService.getSummary(req.params.personaId);
        res.json((0, models_1.ok)(summary));
    },
};
