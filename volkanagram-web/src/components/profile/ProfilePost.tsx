import {IPostCardProps} from "@/types/props"
import Image from "next/image"
import {getPostImageUrl} from "@/utils/imageHelpers"
import {Heart, MessageCircle} from "lucide-react"
import React, {useState} from "react"
import {IPost, IPostComment, IPostLike} from "@/types/post"
import {usePostModal} from "@/hooks/usePostModal"
import {TId} from "@/types/globals";

const ProfilePost = (
  { post, user }: IPostCardProps) => {
  const [commentCount, setCommentCount] = useState<number>(post.commentsCount ?? 0)
  const [updatedPost, setUpdatedPost] = useState<IPost>(post)

  const handleCommentAdded = (newComment: IPostComment) => {
    setCommentCount(prev => prev + 1)
    setUpdatedPost(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }))
  }

  const handleLikeAdded = (like: IPostLike | TId, liked: boolean) => {
    console.log(like, liked)
  }

  const { openViewPostModal, PostModalComponent } = usePostModal({
    post: updatedPost,
    user,
    onCommentAdded: handleCommentAdded,
    onLikedAdded: handleLikeAdded,
  })

  return (
    <div
      onClick={openViewPostModal}
      className="relative group aspect-square bg-gray-100 cursor-pointer">
      <Image
        src={getPostImageUrl(post.photo_url)}
        width={200}
        height={200}
        alt={`Post ${post._id}`}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-1">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-semibold">{post.likesCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="font-semibold">{commentCount}</span>
          </div>
        </div>
      </div>

      <PostModalComponent />
    </div>
  )
}

export default ProfilePost