import { apiSlice } from "./ApisliceMutation";

export const injectedAuthApi = apiSlice.injectEndpoints({
  
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/users/login", // no need for full URL if baseQuery is set
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/users/register", // no need for full URL if baseQuery is set
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logoutRTK: builder.mutation({
      query: (data) => ({
        url: "/users/logout",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation,useRegisterMutation,useLogoutRTKMutation  } = injectedAuthApi;
