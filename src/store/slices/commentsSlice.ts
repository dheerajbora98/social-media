import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { jsonPlaceholderApi } from "../../services/api"

interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

interface CommentsState {
  byPostId: Record<number, Comment[]>
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CommentsState = {
  byPostId: {},
  status: "idle",
  error: null,
}

export const fetchCommentsByPostId = createAsyncThunk(
  "comments/fetchCommentsByPostId",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await jsonPlaceholderApi.get(`/posts/${postId}/comments`)
      return { postId, comments: response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (comment: Omit<Comment, "id">, { rejectWithValue }) => {
    try {
      const response = await jsonPlaceholderApi.post("/comments", comment)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message)
    }
  },
)

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    optimisticAddComment: (state, action: PayloadAction<Comment>) => {
      const { postId } = action.payload
      if (!state.byPostId[postId]) {
        state.byPostId[postId] = []
      }
      state.byPostId[postId].push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.byPostId[action.payload.postId] = action.payload.comments
      })
      .addCase(fetchCommentsByPostId.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload
        if (!state.byPostId[postId]) {
          state.byPostId[postId] = []
        }
        // Replace optimistic comment if it exists
        const index = state.byPostId[postId].findIndex((comment) => comment.id === action.payload.id)
        if (index !== -1) {
          state.byPostId[postId][index] = action.payload
        } else {
          state.byPostId[postId].push(action.payload)
        }
      })
  },
})

export const { optimisticAddComment } = commentsSlice.actions

export default commentsSlice.reducer
