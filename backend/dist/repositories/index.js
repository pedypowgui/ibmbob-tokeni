"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationRepository = exports.GoalRepository = exports.BudgetLimitRepository = exports.TransactionRepository = exports.UserRepository = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const cache = new Map();
function load(personaId) {
    if (cache.has(personaId))
        return cache.get(personaId);
    const file = path.join(__dirname, `../data/${personaId}.json`);
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw);
    cache.set(personaId, data);
    return data;
}
exports.UserRepository = {
    findAll() {
        return ['janaina', 'jose'].map(id => load(id).user);
    },
    findById(id) {
        try {
            return load(id).user;
        }
        catch {
            return null;
        }
    },
};
exports.TransactionRepository = {
    findByPersona(personaId) {
        return load(personaId).transactions;
    },
    findById(personaId, id) {
        return load(personaId).transactions.find(t => t.id === id) ?? null;
    },
};
exports.BudgetLimitRepository = {
    findByPersona(personaId) {
        return load(personaId).budgetLimits;
    },
};
exports.GoalRepository = {
    findByPersona(personaId) {
        // Return a copy so mutations are isolated
        return [...load(personaId).goals];
    },
    findById(personaId, id) {
        return load(personaId).goals.find(g => g.id === id) ?? null;
    },
    save(personaId, goal) {
        const data = load(personaId);
        const idx = data.goals.findIndex(g => g.id === goal.id);
        if (idx >= 0) {
            data.goals[idx] = goal;
        }
        else {
            data.goals.push(goal);
        }
        return goal;
    },
};
exports.GamificationRepository = {
    findByPersona(personaId) {
        return load(personaId).gamification;
    },
    completeMission(personaId, missionId) {
        const profile = load(personaId).gamification;
        const mission = profile.missions.find(m => m.id === missionId);
        if (!mission || mission.completed)
            return false;
        mission.completed = true;
        profile.points += mission.points;
        return true;
    },
};
