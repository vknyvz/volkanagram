import mongoose, {Document, Types} from 'mongoose'
import {IFollow} from "./Follow";

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  fullName: string
  username: string
  bio?: string
  website?: string
  profilePicture?: string
  token?: string
  postsCount?: number
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  createdAt?: Date
  updatedAt?: Date
}

const userSchema = new mongoose.Schema<IUser>({
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true, trim: true},
    username: {type: String, required: true, unique: true, lowercase: true, trim: true},
    bio: {type: String},
    website: {type: String},
    profilePicture: {type: String},
    postsCount: {type: Number},
    followersCount: {type: Number},
    followingCount: {type: Number},
    token: {type: String},
  },
  {timestamps: true}
)

userSchema.set("toJSON", {
  virtuals: true,
  transform: function (
    doc: mongoose.Document<unknown, any, IUser> & IUser,
    ret: Partial<IUser>
  ) {
    delete ret.password;
    delete (ret as any).__v;
    return ret;
  },
})

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user_id",
})

export default mongoose.model<IUser>('User', userSchema)
