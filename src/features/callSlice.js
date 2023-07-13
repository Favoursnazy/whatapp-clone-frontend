import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  call: null,
  peerId: null,
};

export const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    call_a_user: (state, action) => {
      state.call = action.payload;
    },
    end_a_user_call: (state, action) => {
      state.call = null;
    },
    addPeer: (state, action) => {
      state.peerId = action.payload;
    },
  },
  extraReducers(builder) {},
});

export const { call_a_user, end_a_user_call, addPeer } = callSlice.actions;

export default callSlice.reducer;
