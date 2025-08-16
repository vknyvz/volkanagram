import {IPost} from "@/types/post"

export interface IUser {
  _id: string
  id?: string
  email: string
  fullName: string
  username: string
  bio?: string
  website?: string
  profilePicture?: string
  token?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserProfile extends IUser {
  posts?: IPost[]
  isFollowing?: boolean
  postsCount?: number
  followersCount?: number
  followingCount?: number
}

export const DefaultUserProfile = {
  _id: '',
  id: '',
  email: '',
  username: '',
  fullName: '',
  website: '',
  bio: '',
  profilePicture: '',
  isFollowing: false,
  postsCount: 0,
  followersCount: 0,
  followingCount: 0
}

export interface IProfileSliceState {
  data: IUserProfile
  isLoading: boolean
  error: string | null
}
