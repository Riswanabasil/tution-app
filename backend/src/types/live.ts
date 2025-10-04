export interface CreateLiveSession {
  courseId: string;
  topicId?: string;
  hostId: string;
  title: string;
  description?: string;
  startsAtISO: string;    
  durationMin: number;
}
