import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import * as SecureStore from "expo-secure-store"

// Base API setup with RTK Query
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
    prepareHeaders: async (headers) => {
      const token = await SecureStore.getItemAsync("token")
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Posts", "Users", "Comments", "Albums", "Photos"],
  endpoints: (builder) => ({
    // Posts endpoints
    getPosts: builder.query({
      query: (page = 1, limit = 20) => `/posts?_page=${page}&_limit=${limit}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }: { id: number }) => ({ type: "Posts" as const, id })), { type: "Posts", id: "LIST" }]
          : [{ type: "Posts", id: "LIST" }],
    }),
    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    getPostComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [{ type: "Comments", id: `post-${postId}` }],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Posts", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Posts", id }],
    }),

    // Users endpoints
    getUsers: builder.query({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [...result.map(({ id }: { id: number }) => ({ type: "Users" as const, id })), { type: "Users", id: "LIST" }]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    getUserPosts: builder.query({
      query: (userId) => `/users/${userId}/posts`,
      providesTags: (result, error, userId) => [{ type: "Posts", id: `user-${userId}` }],
    }),
    getUserAlbums: builder.query({
      query: (userId) => `/users/${userId}/albums`,
      providesTags: (result, error, userId) => [{ type: "Albums", id: `user-${userId}` }],
    }),

    // Comments endpoints
    addComment: builder.mutation({
      query: (comment) => ({
        url: "/comments",
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: "Comments", id: `post-${postId}` }],
    }),

    // Albums & Photos endpoints
    getAlbums: builder.query({
      query: () => "/albums",
      providesTags: [{ type: "Albums", id: "LIST" }],
    }),
    getAlbumPhotos: builder.query({
      query: (albumId) => `/albums/${albumId}/photos`,
      providesTags: (result, error, albumId) => [{ type: "Photos", id: `album-${albumId}` }],
    }),
    getPhotos: builder.query({
      query: (page = 1, limit = 20) => `/photos?_page=${page}&_limit=${limit}`,
      providesTags: [{ type: "Photos", id: "LIST" }],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostCommentsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserPostsQuery,
  useGetUserAlbumsQuery,
  useAddCommentMutation,
  useGetAlbumsQuery,
  useGetAlbumPhotosQuery,
  useGetPhotosQuery,
} = api
