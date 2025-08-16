import {IUserProfile} from "@/types/user"
import {IPost} from "@/types/post"

export type TApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type TUploadedFile = {
  image: string
  originalName: string
  size: number
}

export type TProfileResponse = {
  profile: IUserProfile
  posts: IPost[]
}

export type TId = {
  id: string
  _id?: string
}
