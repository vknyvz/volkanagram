import { IUserPublic } from './user';
import { IPost } from '../models/Post';

export type TId = {
  id: string
  _id?: string
}

export interface IProfileResponse {
  profile: IUserPublic
  posts: IPost[]
}

export interface IUploadedFile {
  image: string
  originalName: string
  size: number
}

export type TPagination = {
  currentPage: number
  totalPages: number
  hasMore: boolean
  totalPosts: number
}

export interface IFeed {
  posts: IPost[]
  pagination: TPagination
}