import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CONVERSATION_END_POINT, MESSAGES_ENDPOINT } from "../utils/constants";
import Axios from "../api/Axios";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { initializeSocket } = socketSlice.actions;

export default socketSlice.reducer;
