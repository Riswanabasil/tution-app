"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateRange = parseDateRange;
exports.parseGranularity = parseGranularity;
exports.parseLimit = parseLimit;
exports.resolveRange = resolveRange;
exports.startOfToday = startOfToday;
exports.startOfMonth = startOfMonth;
function parseDateRange(q) {
    const to = q.to ? new Date(String(q.to)) : new Date();
    const from = q.from
        ? new Date(String(q.from))
        : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to };
}
function parseGranularity(v, fallback) {
    return v === 'monthly' || v === 'daily' ? v : fallback;
}
function parseLimit(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : fallback;
}
function resolveRange(partial) {
    var _a, _b;
    const to = (_a = partial === null || partial === void 0 ? void 0 : partial.to) !== null && _a !== void 0 ? _a : new Date();
    const from = (_b = partial === null || partial === void 0 ? void 0 : partial.from) !== null && _b !== void 0 ? _b : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to };
}
function startOfToday(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function startOfMonth(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}
