export const APP_CONFIG = {
  name: "Social Dashboard",
  version: "1.0.0",
  apiTimeout: 10000,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  supportedImageFormats: ["jpg", "jpeg", "png", "gif", "webp"],
  supportedVideoFormats: ["mp4", "mov", "avi"],
  maxPostLength: 500,
  maxBioLength: 150,
  maxTagsPerPost: 10,
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  THEME_MODE: "theme_mode",
  ONBOARDING_COMPLETED: "onboarding_completed",
  CACHE_PREFIX: "cache_",
  ANALYTICS_EVENTS: "analytics_events",
}

export const API_ENDPOINTS = {
  JSONPLACEHOLDER: "https://jsonplaceholder.typicode.com",
  DUMMYJSON: "https://dummyjson.com",
  REQRES: "https://reqres.in/api",
}

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  splash: 1000,
}

export const HAPTIC_PATTERNS = {
  light: "light",
  medium: "medium",
  heavy: "heavy",
  success: "success",
  warning: "warning",
  error: "error",
} as const

export const NOTIFICATION_TYPES = {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
  MENTION: "mention",
  POST: "post",
} as const

export const POST_PRIVACY = {
  PUBLIC: "public",
  FRIENDS: "friends",
  PRIVATE: "private",
} as const

export const USER_ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const
