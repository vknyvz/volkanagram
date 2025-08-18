import { useState } from 'react'
import React from 'react'
import PostViewModal from '@/components/modal/PostViewModal'
import {IUsePostModalProps, IUsePostModalReturn} from "@/types/props"

export const usePostModal = ({
  post,
  user,
  onCommentAdded,
  onLikedAdded
  }: IUsePostModalProps): IUsePostModalReturn => {
  const [isOpen, setIsOpen] = useState(false)

  const openViewPostModal = () => setIsOpen(true)
  const closeViewPostModal = () => setIsOpen(false)

  const resolvedUserData = user || (post as any).user

  if (!resolvedUserData) {
    throw new Error('usePostModal: Either post.user must exist or userData must be provided')
  }

  const PostModalComponent = (): React.ReactElement | null => {
    if (!isOpen) {
      return null
    }

    return React.createElement(PostViewModal, {
      closeViewPostModal,
      postData: post,
      userData: resolvedUserData,
      onCommentAdded: onCommentAdded,
      onLikedAdded: onLikedAdded
    })
  }

  return {
    isOpen,
    openViewPostModal,
    closeViewPostModal,
    PostModalComponent
  }
}