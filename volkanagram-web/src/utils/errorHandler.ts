export const handleApiError = (error: unknown): void => {
  const redX = '❌' // ❌ ⛔ 🔴 ✖

  let errorMessage = `${redX} API Error: `
  const errorDetails: any[] = []

  if (error && typeof error === 'object') {
    if ('response' in error && 'message' in error) {
      const axiosLikeError = error as {
        message: string
        response?: {
          status?: number
          data?: unknown
        }
      }

      errorMessage += axiosLikeError.message

      if (axiosLikeError.response) {
        errorMessage += ` | Status: ${axiosLikeError.response.status}`
        if (axiosLikeError.response.data) {
          errorDetails.push('\nResponse Data:', axiosLikeError.response.data)
        }
      }
    } else if (error instanceof Error) {
      errorMessage += error.message
      if (error.stack) {
        errorDetails.push('\nStack:', error.stack)
      }
    } else {
      errorMessage += 'Unknown object error'
      errorDetails.push('\nError Object:', error)
    }
  } else {
    errorMessage += 'Unexpected error'
    errorDetails.push('\nError Value:', error)
  }

  if (errorDetails.length > 0) {
    console.error(errorMessage, ...errorDetails)
  } else {
    console.error(errorMessage)
  }
}