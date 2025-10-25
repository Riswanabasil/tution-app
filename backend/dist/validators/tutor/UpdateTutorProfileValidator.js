'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateUpdateTutorProfileDto = validateUpdateTutorProfileDto;
function validateUpdateTutorProfileDto(body) {
  const data = {};
  if (body.name) data.name = body.name.toString().trim();
  if (body.bio) data.bio = body.bio.toString().trim();
  if (body.profilePicKey) data.profilePicKey = body.profilePicKey.toString().trim();
  return { ok: true, data };
}
