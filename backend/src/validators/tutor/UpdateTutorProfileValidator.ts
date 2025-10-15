import { UpdateTutorProfileDto } from '../../dto/tutor/UpdateTutorProfileDto';

export function validateUpdateTutorProfileDto(body: any): {
  ok: true; data: UpdateTutorProfileDto;
} | {
  ok: false; error: string;
} {
  const data: UpdateTutorProfileDto = {};

  if (body.name) data.name = body.name.toString().trim();
  if (body.bio) data.bio = body.bio.toString().trim();
  if (body.profilePicKey) data.profilePicKey = body.profilePicKey.toString().trim();

  return { ok: true, data };
}
