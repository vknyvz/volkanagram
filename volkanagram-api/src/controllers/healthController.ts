import {Request, Response} from "express";
import ApiResponse from "../utils/apiResponse";
import {getErrorMessage} from "../utils/errorHandler";

export const health = async (req: Request, res: Response) => {
  try {
    return ApiResponse.success(res, {}, 'API is Healthy')
  } catch (e: unknown) {
    return ApiResponse.error(res, getErrorMessage(e))
  }
}