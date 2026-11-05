"use strict";
// ─── User / Persona ───────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.fail = fail;
function ok(data) {
    return { data, error: null };
}
function fail(code, message) {
    return { data: null, error: { code, message } };
}
