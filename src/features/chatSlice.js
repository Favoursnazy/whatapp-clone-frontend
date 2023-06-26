import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const CONVERSATION_ENDPOINT = `${
  import.meta.env.VITE_API_ENDPOINT
}/conversation`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  notifications: [],
};

export const getConversation = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversation.fulfilled, (state, action) => {
        (state.status = "succeeded"), (state.conversations = action.payload);
      })
      .addCase(getConversation.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
