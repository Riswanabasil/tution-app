import { presignGetObject } from '../../utils/s3Presign';

export class TutorMapper {
  static async toResponse(tutor: any) {
    const obj = tutor?.toObject ? tutor.toObject() : tutor;

    const profileUrl = await presignGetObject(obj?.profilePicKey);
    return {
      ...obj,
      profilePic: profileUrl ?? '',
    };
  }
}
