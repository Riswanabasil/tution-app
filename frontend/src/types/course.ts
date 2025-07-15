import type { Module } from "./module";


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
  modules: Array<Pick<Module, '_id' | 'name' | 'order'>>
  reviews?: Array<{ author: string; rating: number; when: string; comment: string }>
  enrolledAt?:string
}
