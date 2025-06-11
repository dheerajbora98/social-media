

import { useState, useCallback } from "react"
import { jsonPlaceholderApi } from "../services/api"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await apiCall()
      setState({
        data: response.data,
        loading: false,
        error: null,
      })
      return response.data
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.message || "An error occurred",
      })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

export function useJsonPlaceholder() {
  const { execute, ...state } = useApi()

  const getPosts = useCallback(
    (page = 1, limit = 20) => {
      return execute(() => jsonPlaceholderApi.get(`/posts?_page=${page}&_limit=${limit}`))
    },
    [execute],
  )

  const getPost = useCallback(
    (id: number) => {
      return execute(() => jsonPlaceholderApi.get(`/posts/${id}`))
    },
    [execute],
  )

  const getUsers = useCallback(() => {
    return execute(() => jsonPlaceholderApi.get("/users"))
  }, [execute])

  const getUser = useCallback(
    (id: number) => {
      return execute(() => jsonPlaceholderApi.get(`/users/${id}`))
    },
    [execute],
  )

  const getUserPosts = useCallback(
    (userId: number) => {
      return execute(() => jsonPlaceholderApi.get(`/users/${userId}/posts`))
    },
    [execute],
  )

  const getComments = useCallback(
    (postId: number) => {
      return execute(() => jsonPlaceholderApi.get(`/posts/${postId}/comments`))
    },
    [execute],
  )

  return {
    ...state,
    getPosts,
    getPost,
    getUsers,
    getUser,
    getUserPosts,
    getComments,
  }
}
