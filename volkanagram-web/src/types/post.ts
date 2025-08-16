import {IUserProfile} from "@/types/user"

export interface IPost {
  _id: string
  id?: string
  user_id: string
  photo_url: string
  caption: string
  location?: string
  likesCount?: number
  commentsCount?: number
  liked?: boolean
  user: IUserProfile
  likes?: IPostLike[]
  comments?: IPostComment[]
  createdAt: string
  updatedAt: string
}

export interface IPostComment {
  _id: string
  id?: string
  post_id: string
  user_id: string
  comment: string
  user: IUserProfile
  createdAt: string
  updatedAt: string
}

export interface IPostLike {
  _id: string
  id?: string
  post_id: string
  user_id: string
  user: IUserProfile
  createdAt: string
  updatedAt: string
}

export const DefaultPostForm = {
  photo_url: '',
  caption: '',
  location: '',
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

