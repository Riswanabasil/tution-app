
import type { Request } from 'express';
type TimeGranularity = 'daily' | 'monthly';
interface DateRange {
  from: Date;
  to: Date;
}

export function parseDateRange(q: Request['query']): DateRange {
  const to = q.to ? new Date(String(q.to)) : new Date();
  const from = q.from
    ? new Date(String(q.from))
    : new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}

export function parseGranularity(v: unknown, fallback: TimeGranularity): TimeGranularity {
  return v === 'monthly' || v === 'daily' ? v : fallback;
}

export function parseLimit(v: unknown, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(n, 100) : fallback;
}
export function resolveRange(partial?: Partial<DateRange>): DateRange {
  const to = partial?.to ?? new Date();
  const from = partial?.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  return { from, to };
}
export function startOfToday(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
