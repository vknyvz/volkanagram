export const UPLOADER_CONFIG = {
  FILE_NAME: 'image',
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  isValidType: (type: string): boolean => {
    return (UPLOADER_CONFIG.ALLOWED_TYPES as readonly string[]).includes(type)
  },
  isValidSize: (size: number): boolean => {
    return size <= UPLOADER_CONFIG.MAX_FILE_SIZE
  }
} as const