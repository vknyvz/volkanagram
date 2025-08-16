export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me'
    },
    FEED: '/feed',
    STORIES: '/stories',
    PROFILE: {
      GET: '/profile',
      FOLLOW: '/profile/:username/follow',
      UNFOLLOW: '/profile/:username/unfollow',
    },
    POST: {
      CREATE: '/post/create/',
      SAVE_COMMENT: '/post/comment',
      LIKE: '/post/like',
      UNLIKE: '/post/unlike',
    },
    USER: {
      GET: '/user',
      SAVE: '/user/edit',
    },
    UPLOADER: '/uploader',
  }
} as const