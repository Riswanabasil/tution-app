"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeRanges = mergeRanges;
exports.sumRanges = sumRanges;
exports.recomputeProgress = recomputeProgress;
function mergeRanges(existing, incoming, clampTo) {
    const all = [...existing, ...incoming]
        .map((r) => ({
        startSec: Math.max(0, clampTo != null ? Math.min(r.startSec, clampTo) : r.startSec),
        endSec: Math.max(0, clampTo != null ? Math.min(r.endSec, clampTo) : r.endSec),
    }))
        .filter((r) => r.endSec > r.startSec)
        .sort((a, b) => a.startSec - b.startSec);
    const merged = [];
    for (const r of all) {
        if (!merged.length) {
            merged.push(Object.assign({}, r));
            continue;
        }
        const last = merged[merged.length - 1];
        if (r.startSec <= last.endSec + 0.01) {
            last.endSec = Math.max(last.endSec, r.endSec);
        }
        else
            merged.push(Object.assign({}, r));
    }
    return merged;
}
function sumRanges(ranges) {
    return ranges.reduce((acc, r) => acc + (r.endSec - r.startSec), 0);
}
function recomputeProgress(opts) {
    const watched = Math.min(sumRanges(opts.ranges), opts.durationSec);
    const percent = Math.round((watched / Math.max(1, opts.durationSec)) * 100);
    const nearEnd = opts.lastPositionSec >= Math.max(0, opts.durationSec - 10);
    const completed = percent >= 90 && nearEnd;
    return { totalWatchedSec: watched, percent: Math.max(0, Math.min(100, percent)), completed };
}
