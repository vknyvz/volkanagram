import {Request, Response} from "express"
import User from "../models/User"
import {Post, PostLike} from "../models/Post"
import ApiResponse from "../utils/apiResponse"
import {getErrorMessage} from "../utils/errorHandler"
import {IUserPublic} from "../types/user"
import {IFeed} from "../types/api";

export const feed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.body?.page)) || 1;
    const limit = parseInt(String(req.body?.limit)) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user')
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
      .lean()

    const likedPostIds = await PostLike.find({
      user_id: req.user?.id,
      post_id: { $in: posts.map(p => p._id) }
    }).distinct('post_id');

    const postsWithFlag = posts.map(post => ({
      ...post,
      liked: likedPostIds.some(id => id.toString() === post._id.toString())
    }));

    const totalPosts = await Post.countDocuments();
    const hasMore = skip + posts.length < totalPosts;

    return ApiResponse.success<IFeed>(res, {
      posts: postsWithFlag,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        hasMore,
        totalPosts
      }
    }, 'Feed loaded')
  } catch(error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const stories = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)

    return ApiResponse.success<IUserPublic[]>(res, users, 'Users loaded')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}