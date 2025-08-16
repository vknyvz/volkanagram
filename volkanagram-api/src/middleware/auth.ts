import {Request, NextFunction, Response} from 'express';
import jwt from 'jsonwebtoken';
import ApiResponse from "../utils/apiResponse";
import {getErrorMessage} from "../utils/errorHandler";
import {IJwtPayload} from '../types/jwt';
import {AUTH_CONFIG} from "../config/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[AUTH_CONFIG.JWT_COOKIE_TOKEN_NAME];
  if (!token) {
    return ApiResponse.unauthorized(res)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = decoded as IJwtPayload;
    next()
  } catch (error) {
    return ApiResponse.error(res, getErrorMessage(error))
  }
}
