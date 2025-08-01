export type CourseDetails = {
  _id: string
  title: string
  code: string
  semester: number
  thumbnail?: string
  demoVideoUrl?: string
  price: number
  offer?: number
  actualPrice?: number
  details?: string
  tutorName: string
  tutorProfilePic:string
  tutorEducation:string
  tutorExperience:string
  tutorSummary:string
  modules: {
    _id: string;
    name: string;
    order: number;
    topics: {
      _id: string;
      title: string;
      description: string;
      order: number;
    }[];
  }[];
  reviews?: Array<{ author: string; rating: number; when: string; comment: string }>
}