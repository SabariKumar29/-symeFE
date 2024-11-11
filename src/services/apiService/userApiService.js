import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiService = createApi({
  reducerPath: "apiService",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_HOST || "http://localhost:3001/",
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (data) => ({
        url: `user/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: `user/register`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `userobject/setProfileImage`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `password/changePassword`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    generateOtp: builder.mutation({
      query: (data) => ({
        url: `password/generateOtp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `password/verifyOtp`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `offer/uploadImage`,
        method: "POST",
        formData: true,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: data,
      }),
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: `offer/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    updateOffer: builder.mutation({
      query: (data) => ({
        url: `offer/update`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getOffers: builder.mutation({
      query: (data) => ({
        url: `offer/offersList?id=${data?.id}&filter=${JSON.stringify(
          data?.filter
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateBookingStatus: builder.mutation({
      query: (data) => ({
        url: `offer/updateBookingStatus`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getUserById: builder.query({
      query: (id) => `userobject/fetch/${id}`,
    }),
    createNotification: builder.mutation({
      query: (data) => ({
        url: `notification/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getNotificationList: builder.mutation({
      query: (data) => ({
        url: `notification/list?userId=${data?.id}&filter=${JSON.stringify(
          data?.filter
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getNotificationUpdate: builder.mutation({
      query: (data) => ({
        url: `notification/update`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getBookingList: builder.mutation({
      query: (data) => ({
        url: `offer/bookingList?id=${data?.id}&filter=${JSON.stringify(
          data?.filter
        )}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getOfferById: builder.mutation({
      query: (data) => ({
        url: `/offer/fetch/${data?.offerId}/${data?.influencerId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    saveOffer: builder.mutation({
      query: (data) => ({
        url: `offer/offer-wishlist`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    reportOffer: builder.mutation({
      query: (data) => ({
        url: `report/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getUserDetailsUpdate: builder.mutation({
      query: (data) => ({
        url: `userobject/update`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    imageUploadUser: builder.mutation({
      query: (data) => ({
        url: `userobject/uploadImage`,
        method: "POST",
        formData: true,
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: data,
      }),
    }),
    getWishList: builder.mutation({
      query: (data) => ({
        url: `offer/user-wishlist/${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    getMessageList: builder.mutation({
      query: (data) => ({
        url: `/chat/list?id=${data?.id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    saveMessage: builder.mutation({
      query: (data) => ({
        url: `chat/saveMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getUserChatList: builder.mutation({
      query: (data) => ({
        url: `/chat/userChat?chatId=${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getCompanyOrInfluencerList: builder.mutation({
      query: (data) => ({
        url: `userobject/userListByType/${data}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createChat: builder.mutation({
      query: (data) => ({
        url: `chat/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `userobject/update`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
    }),
    getChatById: builder.mutation({
      query: (chatId) => ({
        url: `chat/chatById/${chatId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useUpdateUserProfileMutation,
  useResetPasswordMutation,
  useGenerateOtpMutation,
  useVerifyOtpMutation,
  useUploadImageMutation,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useGetOffersMutation,
  useUpdateBookingStatusMutation,
  useGetUserByIdQuery,
  useGetNotificationListMutation,
  useGetNotificationUpdateMutation,
  useGetBookingListMutation,
  useGetOfferByIdMutation,
  useCreateNotificationMutation,
  useSaveOfferMutation,
  useReportOfferMutation,
  useImageUploadUserMutation,
  useGetWishListMutation,
  useGetMessageListMutation,
  useSaveMessageMutation,
  useGetUserChatListMutation,
  useGetCompanyOrInfluencerListMutation,
  useCreateChatMutation,
  useUpdateUserMutation,
  useGetChatByIdMutation,
} = apiService;
