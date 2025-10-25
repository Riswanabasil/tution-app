'use strict';
// import { DateRange } from "../services/tutor/IDashboardService";
Object.defineProperty(exports, '__esModule', { value: true });
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
