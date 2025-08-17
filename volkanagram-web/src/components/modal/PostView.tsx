import React, {useState, useRef, useEffect} from 'react'
import Link from "next/link"
import {Heart, MapPin, X} from 'lucide-react'
import {getPostImageUrl, getUserImageUrl} from "@/utils/imageHelpers"
import Image from "next/image"
import Avatar from "@/components/ui/Avatar"
import TimeAgo from "@/components/ui/TimeAgo"
import {handleApiError} from "@/utils/errorHandler"
import {IPostComment, IPostLike} from "@/types/post"
import {postService} from "@/services/postService"
import {IPostModalProps} from "@/types/props"

const PostViewModal = (
  {
    closeViewPostModal,
    postData,
    userData,
    onCommentAdded,
    onLikedAdded
  }: IPostModalProps) => {
  const initialComments = postData.comments || []
  const initialLikes = postData.likes || []
  const [comments, setComments] = useState<IPostComment[]>(initialComments)
  const [likes, setLikes] = useState<IPostLike[]>(initialLikes)
  const [newCommentText, setNewCommentText] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setComments(postData.comments || [])
  }, [postData.comments])

  useEffect(() => {
    setLikes(postData.likes || [])
  }, [postData.likes])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (window.innerWidth >= 768 && modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        closeViewPostModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [closeViewPostModal])

  const handlePostComment = async () => {
    if (!newCommentText.trim() || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await postService.saveComment({
        post_id: postData._id,
        comment: newCommentText.trim(),
      })

      if (res.data.success) {
        const newComment = res.data.data

        setComments(prev => [...prev, newComment])

        if (onCommentAdded) {
          onCommentAdded(newComment)
        }

        setNewCommentText('')
      }
    } catch (e: unknown) {
      handleApiError(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLiked = async () => {
    const isLiked = postData.liked

    try {
      if (isLiked) {
        const res = await postService.unlike({ post_id: postData._id })
        if (res.data.success) {
          const removedLikeId = res.data.data.id || res.data.data._id
          setLikes(prev => prev.filter(like =>
            (like.id !== removedLikeId) && (like._id !== removedLikeId)
          ))

          if (onLikedAdded) {
            onLikedAdded(res.data.data, true)
          }
        }
      } else {
        const res = await postService.like({ post_id: postData._id })
        if (res.data.success) {
          const newLike = res.data.data as IPostLike
          setLikes(prev => [...prev, newLike])

          if (onLikedAdded) {
            onLikedAdded(newLike, false)
          }
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

  return (
    <div className="fixed inset-0 bg-black/45 md:flex md:items-center md:justify-center md:p-4 z-50 font-sans">
      <div
        ref={modalContentRef}
        className="w-full h-full md:w-full md:max-w-5xl md:h-[90vh] md:rounded-sm md:shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 rounded-full flex items-center justify-center bg-gray-200 border border-gray-200 overflow-hidden">
              {userData.profilePicture ? (
                <Image
                  src={getUserImageUrl(userData.profilePicture)}
                  width={32}
                  height={32}
                  alt={userData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar string={userData.fullName}/>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">{userData.username}</span>
              {postData.location && (
                <div className="flex items-center text-gray-500 text-xs">
                  <MapPin size={12} className="mr-1" />
                  <span>{postData.location}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              closeViewPostModal()
            }}
            className="text-gray-600 hover:text-gray-900 p-2 -mr-2 z-10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 md:w-3/5 flex items-center justify-center bg-black overflow-hidden md:rounded-bl-xl">
          <div className="relative w-full h-full md:aspect-square">
            <Image
              src={getPostImageUrl(postData.photo_url)}
              alt={`Post #${postData._id}`}
              className="object-cover"
              fill
            />
          </div>
        </div>

        <div className="flex-1 md:w-2/5 flex flex-col bg-white md:rounded-br-xl">
          <div className="hidden md:flex items-center p-4 border-b border-gray-200 flex-shrink-0">
            <div className="w-10 h-10 mr-2 rounded-full flex items-center justify-center bg-gray-200 border border-gray-200 overflow-hidden">
              {userData.profilePicture ? (
                <Image
                  src={getUserImageUrl(userData.profilePicture)}
                  width={32}
                  height={32}
                  alt={userData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar string={userData.fullName}/>
              )}
            </div>

            <div className="flex flex-col flex-grow">
              <span className="font-semibold text-gray-800">{userData.username}</span>
              {postData.location && (
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin size={16} className="mr-1" />
                  <span>{postData.location}</span>
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                closeViewPostModal()
              }}
              className="text-gray-600 hover:text-gray-900 p-2 -mr-2 z-10 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow p-4 overflow-y-auto custom-scrollbar text-xs">
            {comments.map((comment, index) => (
              <div key={comment._id || comment.id || index} className="mb-3 flex items-start">
                <div className="w-8 h-8 mr-2 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 border border-gray-100 overflow-hidden">
                  {comment.user.profilePicture ? (
                    <Image
                      src={getUserImageUrl(comment.user.profilePicture)}
                      width={32}
                      height={32}
                      alt={comment.user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Avatar string={comment.user.fullName}/>
                  )}
                </div>
                <div className="flex flex-col">
                  <div>
                    <span className="font-semibold text-gray-800 mr-2">{comment.user.username}</span>
                    <span className="text-gray-700">{comment.comment}</span>
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    <TimeAgo date={comment.createdAt}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <Heart
                onClick={handleLiked}
                size={24}
                className={`cursor-pointer ${postData.liked ? 'fill-red-500 text-red-500' : 'text-black hover:text-gray-500'}`}/>
            </div>

            <div className="flex items-center text-sm text-gray-800 mb-1">
              <div className="flex -space-x-2 mr-2">
                {likes.slice(0, 3).map((likeUser: any, idx: number) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full overflow-hidden border-2 border-white"
                  >
                    {likeUser.user.profilePicture ? (
                      <Image
                        src={getUserImageUrl(likeUser.user.profilePicture)}
                        width={24}
                        height={24}
                        alt={likeUser.user.username}
                        className="object-cover"
                      />
                      ) : (
                      <div
                        className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-gray-400 text-lg font-light text-xs">
                          {likeUser.user.fullName?.split(' ').map((name: string) => name[0]).join('') || '?'}
                        </div>
                      </div>
                      )}
                  </div>
                ))}
              </div>

              {likes.length > 0 && (
                <span>
                  Liked by <span className="font-semibold">
                  <Link
                    href={`/${likes[0].user.username}`}>
                    {likes[0].user.username}
                  </Link>
                </span>
                  {likes.length > 1 && (
                    <>
                      {" "}and{" "}
                      <span className="font-semibold">
                        {likes.length - 1} others
                      </span>
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 uppercase">
              {new Date(postData.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center flex-shrink-0 text-xs bg-white">
            <textarea
              className="flex-grow p-2 text-gray-700 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 mr-3 max-h-24 overflow-y-auto"
              placeholder="Add a comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isSubmitting}
            />
            <button
              onClick={handlePostComment}
              disabled={isSubmitting || !newCommentText.trim()}
              className={`font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-300 transform hover:scale-105 ${
                isSubmitting || !newCommentText.trim()
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostViewModal