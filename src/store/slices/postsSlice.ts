import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { jsonPlaceholderApi } from "../../services/api"

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

interface PostsState {
  items: Post[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  currentPage: number
  hasMore: boolean
}

const initialState: PostsState = {
  items: [],
  status: "idle",
  error: null,
  currentPage: 1,
  hasMore: true,
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (page: number, { rejectWithValue }) => {
  try {
    const response = await jsonPlaceholderApi.get(`/posts?_page=${page}&_limit=20`)
    return { posts: response.data, hasMore: response.data.length === 20 }
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const addNewPost = createAsyncThunk("posts/addNewPost", async (post: Omit<Post, "id">, { rejectWithValue }) => {
  try {
    const response = await jsonPlaceholderApi.post("/posts", post)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.items = []
      state.currentPage = 1
      state.hasMore = true
      state.status = "idle"
    },
    optimisticAddPost: (state, action: PayloadAction<Post>) => {
      state.items.unshift(action.payload)
    },
    optimisticUpdatePost: (state, action: PayloadAction<Post>) => {
      const index = state.items.findIndex((post) => post.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    optimisticDeletePost: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((post) => post.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = state.currentPage === 1 ? action.payload.posts : [...state.items, ...action.payload.posts]
        state.hasMore = action.payload.hasMore
        state.currentPage += 1
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // Replace the optimistic post with the real one if needed
        const index = state.items.findIndex((post) => post.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        } else {
          state.items.unshift(action.payload)
        }
      })
  },
})

export const { resetPosts, optimisticAddPost, optimisticUpdatePost, optimisticDeletePost } = postsSlice.actions

export default postsSlice.reducer
