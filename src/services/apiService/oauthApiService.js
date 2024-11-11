import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const instagramClientId = process.env.REACT_APP_INSTAGRAM_APP_ID;
const instagramClientSecret = process.env.REACT_APP_INSTAGRAM_APP_SECRET;
// const instagramRedirectUrl = process.env.INSTAGRAM_REDIRECT_URL;

export const oauthApiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_HOST || "http://localhost:3001/",
  }),
  endpoints: (builder) => ({
    instagramOauth: builder.mutation({
      query: () => ({
        url: `user/instagram-oauth`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getInstagramAccessToken: builder.mutation({
      query: (data) => ({
        url: `user/instagram-accesstoken`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getInstagramLongLiveToken: builder.mutation({
      query: (data) => ({
        url: `https://graph.instagram.com/access_token?grant_type=ig_exchange_token &client_secret=${instagramClientSecret}&access_token=${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getInstagramUserData: builder.mutation({
      query: (data) => ({
        url: `https://graph.instagram.com/v20.0/me?fields=user_id,username,followers_count&access_token=${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: data,
      }),
    }),
    findUserByInstagramOpenId: builder.mutation({
      query: (data) => ({
        url: `user/loginInstagram`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    updateSocialMediaOpenId: builder.mutation({
      query: (data) => ({
        url: `userobject/addSocialLoginInstagram`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
  }),
});
export const {
  useInstagramOauthMutation,
  useGetInstagramAccessTokenMutation,
  useGetInstagramUserDataMutation,
  useFindUserByInstagramOpenIdMutation,
  useGetInstagramLongLiveTokenMutation,
  useUpdateSocialMediaOpenIdMutation,
} = oauthApiService;
