import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempUserDtls: {},
};
export const userSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setTemporaryUserDtls: (state, action) => {
      state.tempUserDtls = action?.payload;
    },
  },
});
export const { setTemporaryUserDtls } = userSlice.actions;
export default userSlice.reducer;
