'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateUpdateSubmissionReviewDto = validateUpdateSubmissionReviewDto;
function validateUpdateSubmissionReviewDto(body) {
  var _a;
  const raw = (
    (_a = body === null || body === void 0 ? void 0 : body.feedback) !== null && _a !== void 0
      ? _a
      : ''
  )
    .toString()
    .trim();
  if (!raw) return { ok: false, error: 'feedback is required' };
  if (raw.length > 10000) return { ok: false, error: 'feedback too long' };
  return { ok: true, data: { feedback: raw } };
}
