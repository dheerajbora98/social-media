import axios from "axios"
import * as SecureStore from "expo-secure-store"

// Create API instances for each endpoint
export const jsonPlaceholderApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
})

export const dummyJsonApi = axios.create({
  baseURL: "https://dummyjson.com",
})

export const reqresApi = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "x-api-key": "reqres-free-v1",
  },
})

// Default API for auth
export const api = reqresApi

// Add request interceptor to add auth token
jsonPlaceholderApi.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

dummyJsonApi.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

reqresApi.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token refresh
reqresApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken")
        const response = await reqresApi.post("/refresh-token", { refreshToken })
        const { token } = response.data

        await SecureStore.setItemAsync("token", token)

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`

        // Retry the original request
        return reqresApi(originalRequest)
      } catch (refreshError) {
        // If refresh token fails, sign out user
        await SecureStore.deleteItemAsync("token")
        await SecureStore.deleteItemAsync("refreshToken")
        await SecureStore.deleteItemAsync("user")

        // Redirect to login (handled by auth state change)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
