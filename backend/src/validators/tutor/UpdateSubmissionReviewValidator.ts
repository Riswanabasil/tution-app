import { UpdateSubmissionReviewDto } from '../../dto/tutor/UpdateSubmissionReviewDto';

export function validateUpdateSubmissionReviewDto(body: any): {
  ok: true; data: UpdateSubmissionReviewDto;
} | {
  ok: false; error: string;
} {
  const raw = (body?.feedback ?? '').toString().trim();

  if (!raw) return { ok: false, error: 'feedback is required' };
  if (raw.length > 10_000) return { ok: false, error: 'feedback too long' };

  return { ok: true, data: { feedback: raw } };
}
