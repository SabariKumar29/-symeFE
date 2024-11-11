import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messageCount: 0,
};
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessageCount: (state, action) => {
      console.log("test", state, action);
      state.messageCount = action?.payload;
    },
  },
});
export const { setMessageCount } = messageSlice.actions;
export default messageSlice.reducer;
