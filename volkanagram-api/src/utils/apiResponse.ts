import { Response } from 'express'

export class ApiResponse
{
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK
  )
  {
    return res.status(statusCode).json({
      success: true,
      ...(data && { data }),
      ...(message && { message })
    } satisfies ApiSuccessResponse<T>)
  }

  static created<T>(res: Response, data?: T, message = 'Created successfully')
  {
    return this.success(res, data, message, HTTP_STATUS.CREATED)
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode?: string,
    errors?: string[]
  )
  {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errorCode && { errorCode }),
      ...(errors && { errors })
    } satisfies ApiErrorResponse)
  }

  static notFound(res: Response, resource = 'Resource')
  {
    return this.error(
      res,
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND,
      'NOT_FOUND'
    )
  }

  static badRequest(res: Response, message = 'Bad request', errors?: string[])
  {
    return this.error(
      res,
      message,
      HTTP_STATUS.BAD_REQUEST,
      'BAD_REQUEST',
      errors
    )
  }

  static unauthorized(res: Response, message = 'Unauthorized') {
    return this.error(
      res,
      message,
      HTTP_STATUS.UNAUTHORIZED,
      'UNAUTHORIZED'
    )
  }

  static forbidden(res: Response, message = 'Forbidden')
  {
    return this.error(
      res,
      message,
      HTTP_STATUS.FORBIDDEN,
      'FORBIDDEN'
    )
  }

  static conflict(res: Response, message: string)
  {
    return this.error(
      res,
      message,
      HTTP_STATUS.CONFLICT,
      'CONFLICT'
    )
  }

  static validationError(res: Response, message = 'Validation failed', errors?: string[])
  {
    return this.error(
      res,
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      'VALIDATION_ERROR',
      errors
    )
  }
}

export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data?: T;
  message?: string;
}

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  errors?: string[];
}

//export type TApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const

export default ApiResponse