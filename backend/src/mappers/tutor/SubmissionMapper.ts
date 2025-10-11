import { presignGetObject } from '../../utils/s3Presign';

export class SubmissionMapper {
  static async toResponse(submission: any) {
    const obj = submission?.toObject ? submission.toObject() : submission;
    const url = await presignGetObject(obj?.submittedFile);
    return { ...obj, submittedFile: url ?? '' }; 
  }
}
