import mongoose, {Document, Schema, Types} from "mongoose"
import {IUserPublic} from "../types/user";

export interface IPost extends Document {
  user_id: mongoose.Types.ObjectId
  photo_url: string
  caption: string
  location?: string
  likesCount?: number
  commentsCount?: number
  liked?: boolean
  user: IUserPublic
  likes?: IPostLike[]
  comments?: IPostComment[]
}

export interface IPostComment extends Document {
  post_id: mongoose.Types.ObjectId
  user_id: mongoose.Types.ObjectId
  comment: string
  user: IUserPublic
}

export interface IPostLike extends Document {
  post_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  user: IUserPublic
  createdAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    photo_url: {type: String, required: true},
    caption: {type: String, required: true},
    location: {type: String},
    likesCount: {type: Number},
    commentsCount: {type: Number},
  }, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
)

postSchema.virtual('comments', {
  ref: 'PostComment',
  localField: '_id',
  foreignField: 'post_id',
})

postSchema.virtual('likes', {
  ref: 'PostLike',
  localField: '_id',
  foreignField: 'post_id',
})

postSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
})

const commentSchema = new Schema<IPostComment>(
  {
    post_id: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    comment: {type: String, required: true},
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

commentSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
})

const postLikeSchema = new Schema<IPostLike>(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postLikeSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
})

postLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

export const Post = mongoose.model<IPost>('Post', postSchema)
export const PostComment = mongoose.model<IPostComment>('PostComment', commentSchema)
export const PostLike = mongoose.model<IPostLike>("PostLike", postLikeSchema);