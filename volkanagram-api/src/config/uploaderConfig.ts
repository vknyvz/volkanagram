export const UPLOADER_CONFIG = {
  UPLOAD_FILE_NAME : 'image',
  UPLOAD_PATH : '../../public/uploads',
  UPLOAD_LIMIT : 5 * 1024 * 1024,
  UPLOAD_ALLOWED_TYPES : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as string[],
  UPLOAD_FOLDER_NAME_USER_PROFILE_PICTURE : '/profile-pictures',
  UPLOAD_FOLDER_NAME_POST_PICTURE : '/post-pictures',
} as const