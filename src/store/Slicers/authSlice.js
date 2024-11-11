import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNewUser: false,
  userDtls: {},
  instagramData: {
    id: "",
    user_id: "",
    username: "",
    name: "",
    followers_count: 0,
    access_token: "",
    token_type: "",
    expires_in: 0,
  },
  userType: "",
  isCompany: false,
  isLoading: false,
  isLoggedIn: false,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action?.payload;
    },
    setUserDetails: (state, action) => {
      state.userDtls = action.payload;
      state.userType = action.payload?.type;
      state.isCompany = action.payload?.type === "company" ? true : false;
      state.isLoggedIn = action.payload?.isLoggedIn || false;
    },
    setTemporaryUserDtls: (state, action) => {
      state.tempUserDtls = action?.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setClearUserDtls: (state) => {
      state.userDtls = {};
      state.userType = "";
      state.isLoggedIn = false;
      state.instagramData = {};
      state.isNewUser = false;
      state.isLoading = false;
      state.isCompany = false;
    },
    setInstagramData: (state, action) => {
      state.instagramData = state.instagramData || {};
      state.instagramData.id = action?.payload?.id || "";
      state.instagramData.user_id = action?.payload?.user_id || "";
      state.instagramData.username = action?.payload?.username || "";
      state.instagramData.name = action?.payload?.name || "";
      state.instagramData.followers_count =
        action?.payload?.followers_count || 0;
    },
    setInstagramAccessToken: (state, action) => {
      state.instagramData.access_token = action?.payload?.access_token || "";
      state.instagramData.token_type = action?.payload?.token_type || "";
      state.instagramData.token_type = action?.payload?.token_type || "";
    },
    setIsNewUser: (state, action) => {
      state.isNewUser = action?.payload;
    },
  },
});
export const {
  setIsLoggedIn,
  setUserDetails,
  setIsLoading,
  setClearUserDtls,
  setTemporaryUserDtls,
  setInstagramData,
  setInstagramAccessToken,
  setIsNewUser,
} = authSlice.actions;
export default authSlice.reducer;
