import { apiSlice } from "./ApisliceMutation";

export const injectedUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getTeam: builder.query({
      query: () => ({
        url: "/users/get-team",
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    userAction: builder.mutation({
      query: ({ id, isActive }) => ({
        url: `/users/${id}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      }),
    }),
    getNotification: builder.query({
      query: () => ({
        url: "/users/notifications",
        method: "GET",
        credentials: "include",
      }),
    }),
      markNotiAsread: builder.mutation({
      query: (data) => ({
        url: `/users/read-noti?isReadType=${data.type}&id=$${data?.id}`,
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
      chagePassword: builder.mutation({
      query: (data) => ({
        url: `/users/change-password`,
        method: "PUT",
        credentials: "include",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: data,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetTeamQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationQuery,
  useChagePasswordMutation,
  useMarkNotiAsreadMutation
} = injectedUserApi;
