// ✅ this is the corrected line
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_API_URI;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URI,
    credentials: "include", // ✅ REQUIRED for sending cookies
  }),  tagTypes: [],
  endpoints: () => ({}),
});
