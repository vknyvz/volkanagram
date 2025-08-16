import {Request, Response} from "express"
import User from "../models/User"
import {Post, PostLike} from "../models/Post"
import {Follow} from "../models/Follow"
import ApiResponse from "../utils/apiResponse"
import {getErrorMessage} from "../utils/errorHandler"
import { IProfileResponse } from '../types/api';

export const profile = async (req: Request, res: Response) => {
  try {
    const {username} = req.params
    const currentUserId = req.user?.id

    const user = await User.findOne({ username })

    if (!user) {
      return ApiResponse.notFound(res, 'User')
    }

    const profile = await user.populate([
      'postsCount',
      'followersCount',
      'followingCount',
    ])

    const isFollowing = currentUserId ?
      Boolean(await Follow.exists({ follower: currentUserId, following: user._id })) :
      false

    const profileData = {
      ...profile.toJSON(),
      isFollowing
    }

    const posts = await Post.find({ user_id: user._id })
      .lean()
      .sort({ createdAt: -1 })
      .populate([{
        path: 'comments',
        populate: {
          path: 'user',
        },
      }, {
        path: 'likes',
        populate: {
          path: 'user',
        },
      }])
      .populate([
        'commentsCount',
        'likesCount'
      ])

    const likedPostIds = await PostLike.find({
      user_id: user._id,
      post_id: { $in: posts.map(p => p._id) }
    }).distinct('post_id');

    const postsWithFlag = posts.map(post => ({
      ...post,
      liked: likedPostIds.some(id => id.toString() === post._id.toString())
    }));

    return ApiResponse.success<IProfileResponse>(res, {
      profile: profileData,
      posts: postsWithFlag
    }, 'Profile retrieved successfully');
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const follow = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    const currentUserId = req.user?.id

    if (!currentUserId) {
      return ApiResponse.unauthorized(res)
    }

    const targetUser = await User.findOne({ username })
    if (!targetUser) {
      return ApiResponse.notFound(res, "Target User")
    }

    if (targetUser._id.equals(currentUserId)) {
      return ApiResponse.badRequest(res, "You cannot follow yourself")
    }

    await Follow.findOneAndUpdate(
      { follower: currentUserId, following: targetUser._id },
      {},
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: 1 } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      targetUser._id,
      { $inc: { followersCount: 1 } },
      { new: true }
    );

    return ApiResponse.success(res, {}, "Followed successfully")
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const unfollow = async (req: Request, res: Response) => {
  try {
    const { username } = req.params
    const currentUserId = req.user?.id

    if (!currentUserId) {
      return ApiResponse.unauthorized(res)
    }

    const targetUser = await User.findOne({ username })
    if (!targetUser) {
      return ApiResponse.notFound(res, "Target User")
    }

    if (targetUser._id.equals(currentUserId)) {
      return ApiResponse.badRequest(res, "You cannot unfollow yourself")
    }

    await Follow.findOneAndDelete({ follower: currentUserId, following: targetUser._id })

    await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: -1 } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      targetUser._id,
      { $inc: { followersCount: -1 } },
      { new: true }
    );

    return ApiResponse.success(res, {}, 'UnFollowed successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}
