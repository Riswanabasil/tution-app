import { IModule } from "../models/module/ModuleSchema"

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
  modules: Array<Pick<IModule, '_id' | 'name' | 'order'>>
  reviews?: Array<{ author: string; rating: number; when: string; comment: string }>
}