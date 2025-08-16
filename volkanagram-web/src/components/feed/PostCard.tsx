"use client"

import React, {useEffect, useRef, useState} from 'react'
import Image from 'next/image'
import {Heart, MessageCircle, MoreHorizontal, Share} from 'lucide-react'
import {getPostImageUrl, getUserImageUrl} from "@/utils/imageHelpers"
import Avatar from "@/components/ui/Avatar"
import TimeAgo from "@/components/ui/TimeAgo"
import Link from "next/link"
import {IPostCardProps} from '@/types/props'
import {IPost, IPostComment, IPostLike} from "@/types/post"
import {handleApiError} from "@/utils/errorHandler"
import {postService} from "@/services/postService"
import {usePostModal} from "@/hooks/usePostModal"
import {TId} from "@/types/globals"

const PostCard = ({ post }: IPostCardProps) => {
  const captionRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
  const [newCommentText, setNewCommentText] = useState<string>('')
  const [commentCount, setCommentCount] = useState<number>(post.commentsCount ?? 0)
  const [likesCount, setLikesCount] = useState<number>(post.likesCount ?? 0)
  const [updatedPost, setUpdatedPost] = useState<IPost>(post)

  useEffect(() => {
    const el = captionRef.current
    if (!el) {
      return
    }

    const hasOverflow =
      el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth

    setIsOverflowing(hasOverflow)
  }, [post.caption])

  const handlePostComment = async () => {
    if (!newCommentText.trim()) {
      return
    }

    try {
      const res = await postService.saveComment({
        post_id: post._id,
        comment: newCommentText.trim(),
      })

      if (res.data.success) {
        setNewCommentText('')
        setCommentCount(prev => prev + 1)

        const newComment = res.data.data

        setUpdatedPost(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }))
      }
    } catch (e: unknown) {
      handleApiError(e)
    }
  }

  const handleLiked = async () => {
    const isLiked = updatedPost.liked

    try {
      if (isLiked) {
        // Unlike operation
        const res = await postService.unlike({ post_id: post._id })
        if (res.data.success) {
          const removedLikeId = res.data.data.id || res.data.data._id
          setLikesCount(prev => prev - 1)
          setUpdatedPost(prev => ({
            ...prev,
            likes: prev.likes?.filter(like =>
              (like.id !== removedLikeId) && (like._id !== removedLikeId)
            ) || [],
            liked: false
          }))
        }
      } else {
        // Like operation
        const res = await postService.like({ post_id: post._id })
        if (res.data.success) {
          const newLike = res.data.data as IPostLike // Type assertion
          setLikesCount(prev => prev + 1)
          setUpdatedPost(prev => ({
            ...prev,
            likes: [...(prev.likes || []), newLike],
            liked: true
          }))
        }
      }
    } catch (e: unknown) {
      handleApiError(e)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      void handlePostComment()
    }
  }

  const handleCommentAdded = (newComment: IPostComment) => {
    setCommentCount(prev => prev + 1)
    setUpdatedPost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }))
  }

  const handleLikedAdded = (likeData: IPostLike | TId, wasUnliked: boolean) => {
    if (wasUnliked) {
      // Unlike operation - likeData is TId
      const removedLikeId = (likeData as TId).id || (likeData as any)._id
      setLikesCount(prev => prev - 1)
      setUpdatedPost(prev => ({
        ...prev,
        likes: prev.likes?.filter(like =>
          (like.id !== removedLikeId) && (like._id !== removedLikeId)
        ) || [],
        liked: false
      }))
    } else {
      // Like operation - likeData is IPostLike
      const newLike = likeData as IPostLike
      setLikesCount(prev => prev + 1)
      setUpdatedPost(prev => ({
        ...prev,
        likes: [...(prev.likes || []), newLike],
        liked: true
      }))
    }
  }

  const { openViewPostModal, PostModalComponent } = usePostModal({
    post: updatedPost,
    user: null,
    onCommentAdded: handleCommentAdded,
    onLikedAdded: handleLikedAdded
  })

  return (
    <div key={post.id} className="bg-white mb-6 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-0 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 overflow-hidden">
            <Link
              href={`/${post.user.username}`}
              className="w-full h-full flex items-center justify-center">
              {post.user.profilePicture ? (
                <Image
                  src={getUserImageUrl(post.user.profilePicture)}
                  alt={post.user.username}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Avatar string={post.user.fullName}/>
              )}
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <span className="font-semibold text-sm text-black">
              <Link href={`/${post.user.username}`}>
                {post.user.username}
              </Link>
            </span>

            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-gray-500 text-sm">• <TimeAgo date={post.createdAt}/></span>
          </div>
        </div>

        <MoreHorizontal size={20} className="text-black hover:text-gray-500 cursor-pointer" />
      </div>

      <div className="w-full sm:mx-0">
        <div className="w-full h-80 sm:h-96 bg-gray-100 relative overflow-hidden cursor-pointer">
          <Image
            src={getPostImageUrl(post.photo_url)}
            onClick={openViewPostModal}
            alt={post.caption}
            fill
            className="object-cover rounded"
            sizes="(max-width: 640px) 100vw, 500px"
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Heart
              onClick={handleLiked}
              size={24}
              className={`cursor-pointer ${updatedPost.liked ? 'fill-red-500 text-red-500' : 'text-black hover:text-gray-500'}`}
            />
            <MessageCircle
              onClick={openViewPostModal}
              size={24}
              className="text-black hover:text-gray-500 cursor-pointer"
            />
            {/*<Share size={24} className="text-black hover:text-gray-500 cursor-pointer" />*/}
          </div>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-sm text-black">
            {likesCount ?? 0} like{likesCount == 1 ? '' : 's'}
          </span>
        </div>

        <div className="mb-2">
          <div
            ref={captionRef}
            className={`text-sm text-black ${expanded ? '' : 'line-clamp-2'}`}>
            <span className="font-semibold mr-2">
              <Link href={`/${post.user.username}`}>
                {post.user.username}
              </Link>
            </span>
            <span>
              {post.caption}
            </span>
          </div>

          {!expanded && isOverflowing && (
            <button
              onClick={() => setExpanded(true)}
              className="text-gray-500 text-sm ml-1 cursor-pointer"
            >
              more
            </button>
          )}
        </div>

        <button
          onClick={openViewPostModal}
          className="text-gray-500 text-sm mb-3 cursor-pointer hover:text-gray-700 transition-colors"
        >
          View all {commentCount} comments
        </button>

        <div className="pt-3">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="w-full text-sm outline-none text-black bg-white placeholder-gray-500"
          />
        </div>
      </div>

      <PostModalComponent />
    </div>
  )
}

export default PostCard