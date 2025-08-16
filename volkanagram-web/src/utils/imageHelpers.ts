const API_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || ''

export const getUserImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''

  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  return `${API_IMAGE_URL}/u/${cleanPath}`
}

export const getPostImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''

  if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  return `${API_IMAGE_URL}/p/${cleanPath}`
}