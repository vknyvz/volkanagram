import {Request, Response} from "express"
import User from "../models/User"
import ApiResponse from "../utils/apiResponse"
import {IUserPublic} from "../types/user"
import {getErrorMessage} from "../utils/errorHandler"

export const get = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id)

  if (!user) {
    return ApiResponse.unauthorized(res)
  }

  return ApiResponse.success<IUserPublic>(res, user.toJSON(), 'User data retrieved successfully')
}

export const edit = async (req: Request, res: Response) => {
  const {
    fullName,
    website,
    bio,
    profilePicture,
  } = req.body

  try {
    const user = await User.findById(req.user?.id)

    if (!user) {
      return ApiResponse.unauthorized(res)
    }

    if (fullName) user.fullName = fullName
    if (website) user.website = website
    if (bio) user.bio = bio
    if (profilePicture) user.profilePicture = profilePicture

    await user.save()

    return ApiResponse.success<IUserPublic>(res, user.toJSON(), 'Profile updated successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}
