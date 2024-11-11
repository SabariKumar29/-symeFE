import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const adminApiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_HOST || "http://localhost:3001/",
  }),
  endpoints: (builder) => ({
    fetchUserList: builder.mutation({
      query: (data) => ({
        url: `userobject/userList/${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});
export const { useFetchUserListMutation } = adminApiService;
