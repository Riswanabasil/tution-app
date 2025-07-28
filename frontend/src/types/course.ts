


export interface ICourse {
  _id: string;
  title: string;
  code: string;
  semester: number;
  thumbnail?: string;
  demoVideoUrl?:string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  status:string,
  createdAt?: string;
  updatedAt?: string;
}

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
  tutorProfilePic: string;
  tutorEducation: string;
  tutorExperience: string;
  tutorSummary: string;
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
  enrolledAt?:string
}



export type Module = {
  _id: string;
  name: string;
  courseId: string;
  description?: string;
  order?: number;
};

export type Topic = {
  _id: string;
  moduleId: string;
  title: string;
  description?: string;
  order?: number;
};
