import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {v4 as uuidv4} from 'uuid'
import {UPLOADER_CONFIG} from "../config/uploaderConfig"
import {Request} from 'express'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subfolder = req.query.folder as string || ''
    const uploadPath = path.join(__dirname, UPLOADER_CONFIG.UPLOAD_PATH, subfolder)

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {recursive: true})
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname)
    const uniqueName = `${uuidv4()}${fileExtension}`
    cb(null, uniqueName)
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (UPLOADER_CONFIG.UPLOAD_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOADER_CONFIG.UPLOAD_LIMIT
  }
})

export const uploadMiddleware = upload.single(UPLOADER_CONFIG.UPLOAD_FILE_NAME)