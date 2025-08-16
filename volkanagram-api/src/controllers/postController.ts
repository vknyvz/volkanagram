import {Request, Response} from "express"
import User from "../models/User"
import {IPost, IPostComment, IPostLike, Post, PostComment, PostLike} from "../models/Post"
import ApiResponse from "../utils/apiResponse"
import {getErrorMessage} from "../utils/errorHandler"
import {SERVER_EVENTS} from "../utils/socketEvents";
import {getSocketService} from "../services/socketService";
import {TId} from "../types/api"

export const create = async (req: Request, res: Response) => {
  try {
    const {
      photo_url,
      caption,
      location,
    } = req.body

    const userId = req.user?.id
    const user = await User.findById(userId)

    if (!userId || !user) {
      return ApiResponse.unauthorized(res)
    }

    const post = await Post.create({
      user_id: userId,
      photo_url,
      caption,
      location,
    })

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { postsCount: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return ApiResponse.badRequest(res, 'Failed to update user post count');
    }

    getSocketService().emitToUser(
      userId,
      SERVER_EVENTS.POST_COUNT_UPDATED,
      {postsCount: updatedUser.postsCount}
    )

    return ApiResponse.created<IPost>(res, post, 'Post created successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const byId = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      });

    if (!post) {
      return ApiResponse.notFound(res, 'Post')
    }

    return ApiResponse.success<IPost>(res, post, 'Post retrieved successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
};

export const comment = async (req: Request, res: Response) => {
  try {
    const {
      post_id,
      comment,
    } = req.body

    const userId = req.user?.id
    const user = await User.findById(userId)

    if (!user) {
      return ApiResponse.unauthorized(res)
    }

    const newComment = await PostComment.create({
      user_id: userId,
      post_id,
      comment,
    })

    const commentWithCommentor = await PostComment.findById(newComment._id)
      .populate('user')

    if (!commentWithCommentor) {
      return ApiResponse.badRequest(res, 'Failed to create comment')
    }

    await Post.findByIdAndUpdate(
      post_id,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    return ApiResponse.created<IPostComment>(res, commentWithCommentor, 'Post comment added successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const like = async (req: Request, res: Response) => {
  try {
    const {
      post_id
    } = req.body

    const userId = req.user?.id
    const user = await User.findById(userId)

    if (!user) {
      return ApiResponse.unauthorized(res)
    }

    const newLike = await PostLike.create({
      user_id: userId,
      post_id
    })

    const likeWithUser = await PostLike.findById(newLike._id)
      .populate('user')

    if (!likeWithUser) {
      return ApiResponse.badRequest(res, 'Failed to like a post')
    }

    await Post.findByIdAndUpdate(
      post_id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    return ApiResponse.created<IPostLike>(res, likeWithUser, 'Post liked successfully')
  } catch(error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const unlike = async (req: Request, res: Response) => {
  try {
    const {
      post_id
    } = req.body

    const userId = req.user?.id
    const user = await User.findById(userId)

    if (!user) {
      return ApiResponse.unauthorized(res)
    }

    const post = await Post.findById(post_id)
    if (!post) {
      return ApiResponse.notFound(res, 'Post')
    }

    const deleted = await PostLike.findOneAndDelete({ user_id: userId, post_id })

    await Post.findByIdAndUpdate(
      post_id,
      { $inc: { likesCount: -1 } },
      { new: true }
    );

    if (!deleted) {
      return ApiResponse.notFound(res, 'Post')
    }

    return ApiResponse.success<TId>(res, {
      id: deleted._id as string,
      _id: deleted._id as string
    }, 'Post unliked successfully')
  } catch(error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}