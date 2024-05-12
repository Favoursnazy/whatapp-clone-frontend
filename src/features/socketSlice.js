import { createSlice } from "@reduxjs/toolkit";

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
    clearSocket: (state) => {
      state.socket = null;
    },
  },
});

export const { initializeSocket, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
