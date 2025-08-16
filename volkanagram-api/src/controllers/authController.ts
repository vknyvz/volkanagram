import {Request, Response} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import {getErrorMessage} from "../utils/errorHandler"
import {ApiResponse} from "../utils/apiResponse"
import {IUserPublic} from "../types/user"
import {REGEX_PATTERNS} from '../utils/regexValidators'
import {AUTH_CONFIG} from "../config/auth"

export const me = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id)

    if (!user) {
      return ApiResponse.notFound(res, 'User')
    }

    return ApiResponse.success<IUserPublic>(res, user.toJSON(), 'User data retrieved successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    fullName,
    username,
  } = req.body
  const errors = []

  if (!email || !REGEX_PATTERNS.EMAIL.test(email)) {
    errors.push('Invalid email address')
  }

  if (!password || !REGEX_PATTERNS.PASSWORD.test(password)) {
    errors.push('Password must be at least 6 characters long and include only letters, numbers, and ()?^*&')
  }

  if (!fullName || !REGEX_PATTERNS.FULL_NAME.test(fullName)) {
    errors.push('Full name must be at least 3 characters long and letters only')
  }

  if (!username || !REGEX_PATTERNS.USERNAME.test(username)) {
    errors.push('Username must be at least 3 characters long and letters and numbers only')
  }

  if (errors.length > 0) {
    return ApiResponse.validationError(res, 'Registration failed', errors)
  }

  try {
    const existingUser = await User.findOne({
      $or: [{email}, {username}],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return ApiResponse.conflict(res, 'User with this email already exists')
      }

      if (existingUser.username === username) {
        return ApiResponse.conflict(res, 'Username is already taken')
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      username,
    })

    return ApiResponse.created<IUserPublic>(res, user.toJSON(), 'User registered successfully')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const login = async (req: Request, res: Response) => {
  const {
    email,
    password
  } = req.body

  try {
    const user = await User.findOne({email})
    if (!user) {
      return ApiResponse.notFound(res, 'User')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return ApiResponse.unauthorized(res, 'Invalid credentials')
    }

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET!,
      {expiresIn: AUTH_CONFIG.JWT_EXPIRES_IN}
    )

    const userWithToken = user.toJSON();
    userWithToken.token = token

    res.cookie(AUTH_CONFIG.JWT_COOKIE_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.JWT_COOKIE_MAX_AGE,
    })

    return ApiResponse.success<IUserPublic>(res, userWithToken, 'Login was successful')
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie(AUTH_CONFIG.JWT_COOKIE_TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return ApiResponse.success(res, {}, 'Logged out successfully')
}
