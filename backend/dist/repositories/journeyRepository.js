"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProgressRepository = exports.XPHistoryRepository = exports.MissionRepository = exports.LevelRepository = exports.JourneyRepository = void 0;
// ─── In-memory stores (reset on process restart; acceptable for MVP) ──────────
const journeys = new Map();
const levels = new Map();
const missions = new Map();
const xpHistory = [];
const userProgress = new Map();
// ─── Helpers ─────────────────────────────────────────────────────────────────
function ensureProgress(profileId) {
    if (!userProgress.has(profileId)) {
        userProgress.set(profileId, {
            profileId,
            totalXp: 0,
            completedMissions: [],
            unlockedAchievements: [],
        });
    }
    return userProgress.get(profileId);
}
// ─── Journey ─────────────────────────────────────────────────────────────────
exports.JourneyRepository = {
    findByPersona(profileId) {
        return Array.from(journeys.values()).filter(j => j.profileId === profileId);
    },
    findActiveByPersona(profileId) {
        return (Array.from(journeys.values()).find(j => j.profileId === profileId && (j.status === 'active' || j.status === 'pending_approval')) ?? null);
    },
    findById(id) {
        return journeys.get(id) ?? null;
    },
    save(journey) {
        journeys.set(journey.id, journey);
        return journey;
    },
    updateStatus(id, status) {
        const journey = journeys.get(id);
        if (!journey)
            return null;
        journey.status = status;
        journey.updatedAt = new Date().toISOString();
        if (status === 'active')
            journey.approvedAt = new Date().toISOString();
        return journey;
    },
    updateProgress(id, journeyProgress, financialProgress) {
        const journey = journeys.get(id);
        if (!journey)
            return null;
        journey.journeyProgress = journeyProgress;
        journey.financialProgress = financialProgress;
        journey.updatedAt = new Date().toISOString();
        return journey;
    },
    updateAccumulated(id, amount) {
        const journey = journeys.get(id);
        if (!journey)
            return null;
        journey.accumulatedAmount = amount;
        journey.financialProgress = journey.targetAmount > 0
            ? Math.min(100, (amount / journey.targetAmount) * 100)
            : 0;
        journey.updatedAt = new Date().toISOString();
        return journey;
    },
};
// ─── Levels ──────────────────────────────────────────────────────────────────
exports.LevelRepository = {
    findByJourney(journeyId) {
        return Array.from(levels.values())
            .filter(l => l.journeyId === journeyId)
            .sort((a, b) => a.order - b.order);
    },
    findById(id) {
        return levels.get(id) ?? null;
    },
    save(level) {
        levels.set(level.id, level);
        return level;
    },
    complete(id) {
        const level = levels.get(id);
        if (!level)
            return null;
        level.status = 'completed';
        level.completedAt = new Date().toISOString();
        return level;
    },
};
// ─── Missions ────────────────────────────────────────────────────────────────
exports.MissionRepository = {
    findByJourney(journeyId) {
        return Array.from(missions.values()).filter(m => m.journeyId === journeyId);
    },
    findByLevel(levelId) {
        return Array.from(missions.values()).filter(m => m.levelId === levelId);
    },
    findById(id) {
        return missions.get(id) ?? null;
    },
    save(mission) {
        missions.set(mission.id, mission);
        return mission;
    },
    updateStatus(id, status) {
        const mission = missions.get(id);
        if (!mission)
            return null;
        mission.status = status;
        if (status === 'completed')
            mission.completedAt = new Date().toISOString();
        return mission;
    },
};
// ─── XP History ──────────────────────────────────────────────────────────────
exports.XPHistoryRepository = {
    findByPersona(profileId) {
        return xpHistory.filter(x => x.profileId === profileId);
    },
    alreadyRewarded(profileId, missionId, weekKey) {
        return xpHistory.some(x => x.profileId === profileId &&
            x.missionId === missionId &&
            (weekKey ? x.sourceId === `${missionId}:${weekKey}` : true));
    },
    add(entry) {
        xpHistory.push(entry);
        return entry;
    },
};
// ─── User Progress ────────────────────────────────────────────────────────────
exports.UserProgressRepository = {
    find(profileId) {
        return ensureProgress(profileId);
    },
    addXp(profileId, amount) {
        const p = ensureProgress(profileId);
        p.totalXp += amount;
        return p;
    },
    markMissionComplete(profileId, missionId) {
        const p = ensureProgress(profileId);
        if (!p.completedMissions.includes(missionId))
            p.completedMissions.push(missionId);
        return p;
    },
};
