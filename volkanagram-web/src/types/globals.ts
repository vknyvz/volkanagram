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

export interface ModalContextType {
  modals: ModalState
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  isModalOpen: (modalId: string) => boolean
}

export interface ModalState {
  [key: string]: boolean
}
