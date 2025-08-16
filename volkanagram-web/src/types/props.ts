import {IPost, IPostComment, IPostLike} from "@/types/post"
import React from "react"
import {IUserProfile} from "@/types/user"
import {TId} from "@/types/globals"

export interface IAppLayoutProps {
  children: React.ReactNode
  showStories?: boolean
  showRightSide?: boolean
  profilePage?: boolean
  stories?: IUserProfile[]
}

export interface IPostListProps {
  posts: IPost[]
}

export interface IPostCardProps {
  post: IPost
  user?: IUserProfile | null,
}

export type TButtonProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement>
>

export interface IAvatarProps {
  string?: string
  className?: string,
}

export interface IPostModalProps {
  closeViewPostModal: () => void
  postData: IPost
  userData: IUserProfile
  onCommentAdded: (newComment: IPostComment) => void
  onLikedAdded: (newLike: IPostLike | TId, liked: boolean) => void
}

export interface ILoaderProps {
  stage?: string
  size?: number
  fullScreen?: boolean
  message?: string
}

export interface IUsePostModalProps {
  post: IPost
  user?: IUserProfile | null
  onCommentAdded: (comment: IPostComment) => void
  onLikedAdded: (like: IPostLike | TId, liked: boolean) => void
}

export interface IUsePostModalReturn {
  isOpen: boolean
  openViewPostModal: () => void
  closeViewPostModal: () => void
  PostModalComponent: () => React.ReactElement | null
}