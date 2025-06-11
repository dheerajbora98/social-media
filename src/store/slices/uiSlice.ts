import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  isOffline: boolean
  pendingActions: any[]
  currentFilter: "all" | "friends" | "trending" | "recent"
  searchQuery: string
  recentSearches: string[]
  isDarkMode: boolean
}

const initialState: UiState = {
  isOffline: false,
  pendingActions: [],
  currentFilter: "all",
  searchQuery: "",
  recentSearches: [],
  isDarkMode: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload
    },
    addPendingAction: (state, action: PayloadAction<any>) => {
      state.pendingActions.push(action.payload)
    },
    clearPendingAction: (state, action: PayloadAction<number>) => {
      state.pendingActions = state.pendingActions.filter((_, index) => index !== action.payload)
    },
    setCurrentFilter: (state, action: PayloadAction<"all" | "friends" | "trending" | "recent">) => {
      state.currentFilter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      // Add to recent searches and remove duplicates
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter((search) => search !== action.payload),
      ].slice(0, 10) // Keep only 10 recent searches
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
  },
})

export const {
  setOfflineStatus,
  addPendingAction,
  clearPendingAction,
  setCurrentFilter,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  toggleDarkMode,
} = uiSlice.actions

export default uiSlice.reducer
