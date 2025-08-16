import {Request, Response} from "express"
import fs from "fs"
import path from "path"
import {UPLOADER_CONFIG} from "../config/uploaderConfig"
import ApiResponse from "../utils/apiResponse"
import {getErrorMessage} from "../utils/errorHandler";
import {IUploadedFile} from "../types/api";

export const viewer = (req: Request, res: Response) => {
  try {
    let {type} = req.params
    const {filename} = req.params

    if (type == 'u') {
      type = UPLOADER_CONFIG.UPLOAD_FOLDER_NAME_USER_PROFILE_PICTURE
    } else if (type == 'p') {
      type = UPLOADER_CONFIG.UPLOAD_FOLDER_NAME_POST_PICTURE
    }

    const filePath = path.join(__dirname, UPLOADER_CONFIG.UPLOAD_PATH + type, filename)

    if (!fs.existsSync(filePath)) {
      return ApiResponse.notFound(res, 'File')
    }

    res.sendFile(filePath)
  } catch (e) {
    return ApiResponse.error(res, getErrorMessage(e))
  }
}

export const uploader = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return ApiResponse.badRequest(res, 'No file was uploaded')
    }

    const userId = req.user?.id

    if (!userId) {
      fs.unlinkSync(req.file.path)

      return ApiResponse.unauthorized(res)
    }

    return ApiResponse.success<IUploadedFile>(res, {
      image: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }, 'File uploaded successfully')
  } catch (e) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    return ApiResponse.error(res, getErrorMessage(e))
  }
}