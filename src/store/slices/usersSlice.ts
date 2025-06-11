import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { jsonPlaceholderApi, dummyJsonApi } from "../../services/api"

interface User {
  id: number
  name: string
  username: string
  email: string
  address?: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone?: string
  website?: string
  company?: {
    name: string
    catchPhrase: string
    bs: string
  }
  // DummyJSON additional fields
  firstName?: string
  lastName?: string
  image?: string
}

interface UsersState {
  items: User[]
  selectedUser: User | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: UsersState = {
  items: [],
  selectedUser: null,
  status: "idle",
  error: null,
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await jsonPlaceholderApi.get("/users")
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchUserById = createAsyncThunk("users/fetchUserById", async (userId: number, { rejectWithValue }) => {
  try {
    const response = await jsonPlaceholderApi.get(`/users/${userId}`)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

export const fetchRichUserData = createAsyncThunk("users/fetchRichUserData", async (_, { rejectWithValue }) => {
  try {
    const response = await dummyJsonApi.get("/users")
    return response.data.users
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload
        // Also update in the items array if it exists
        const index = state.items.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(fetchRichUserData.fulfilled, (state, action) => {
        // Merge rich user data with existing users
        const richUsers = action.payload
        state.items = state.items.map((user) => {
          const richUser = richUsers.find((ru: any) => ru.id === user.id)
          return richUser ? { ...user, ...richUser } : user
        })
      })
  },
})

export const { setSelectedUser, clearSelectedUser } = usersSlice.actions

export default usersSlice.reducer
