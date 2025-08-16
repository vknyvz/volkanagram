export const handleApiError = (error: unknown): void => {
  if (error && typeof error === 'object') {
    if ('response' in error && 'message' in error) {
      const axiosLikeError = error as {
        message: string
        response?: {
          status?: number
          data?: unknown
        }
      }

      console.error(`API Error: ${axiosLikeError.message}`)

      if (axiosLikeError.response) {
        console.error(`Status: ${axiosLikeError.response.status}`)
        console.error(`Data:`, axiosLikeError.response.data)
      }
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    } else {
      console.error('Unknown object error:', error)
    }
  } else {
    console.error('Unexpected error:', error)
  }
}