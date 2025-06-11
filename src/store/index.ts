import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { persistStore, persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers } from "redux"
import { api } from "./services/api"
import postsReducer from "./slices/postsSlice"
import usersReducer from "./slices/usersSlice"
import commentsReducer from "./slices/commentsSlice"
import uiReducer from "./slices/uiSlice"

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["posts", "users", "comments"], // Only persist these reducers
}

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  posts: postsReducer,
  users: usersReducer,
  comments: commentsReducer,
  ui: uiReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(api.middleware),
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
