import { ICourse } from '../models/course/CourseSchema';

export type CourseDetails = {
  _id: string;
  title: string;
  code: string;
  semester: number;
  thumbnail?: string;
  demoVideoUrl?: string;
  price: number;
  offer?: number;
  actualPrice?: number;
  details?: string;
  tutorName: string;
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
  reviews?: Array<{ author: string; rating: number; when: string; comment: string }>;
};
export type CourseStatus = 'pending' | 'approved' | 'rejected';

export interface IPaginateOptions {
  skip: number;
  limit: number;
  sort?: Record<string, 1 | -1>;
}
export type CourseListItem = {
  _id: string;
  title: string;
  code: string;
  semester: number;
  tutor: string;
  status: CourseStatus;
  createdAt: Date;
};
export type TutorPendingCourseItem = {
  _id: string;
  title: string;
  code: string;
  semester: number;
  createdAt: Date;
};

export type TutorCourseListItem = {
  _id: string;
  title: string;
  code: string;
  semester: number;
  status: CourseStatus;
  price: number;
  createdAt: Date;
};

export interface PaginatedCourses {
  courses: ICourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
