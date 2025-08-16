export const CLIENT_EVENTS = {
  USER_IDENTIFY: 'user:identify'
};

export const SERVER_EVENTS = {
  POST_COUNT_UPDATED: 'post:count-updated'
};

export const ROOMS = {
  user: (userId: string) => `user:${userId}`,
  //post: (postId: string) => `post:${postId}`
} as const;