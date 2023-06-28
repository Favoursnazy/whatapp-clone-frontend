import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const CONVERSATION_ENDPOINT = `${
  import.meta.env.VITE_API_ENDPOINT
}/conversation`;
const MESSAGES_ENDPOINT = `${import.meta.env.VITE_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  notifications: [],
  messages: [],
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

//OPEN A NEW CONVERSATION
export const createConversation = createAsyncThunk(
  "conversation/open_conversation",
  async (values, { rejectWithValue }) => {
    const { token, reciever_id } = values;
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { reciever_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

//GET ALL MESSAGES
export const getConversationMessages = createAsyncThunk(
  "conversation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      const { data } = await axios.get(`${MESSAGES_ENDPOINT}/${convo_id}`, {
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

export const sendMessageToUser = createAsyncThunk(
  "conversation/send_message",
  async (values, { rejectWithValue }) => {
    const { token, convo_id, message, files } = values;
    try {
      const { data } = await axios.post(
        MESSAGES_ENDPOINT,
        { message, convo_id, files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      })
      .addCase(createConversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        (state.status = "succeeded"),
          (state.activeConversation = action.payload);
      })
      .addCase(createConversation.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      })
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        (state.status = "succeeded"), (state.messages = action.payload);
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      })
      .addCase(sendMessageToUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendMessageToUser.fulfilled, (state, action) => {
        (state.status = "succeeded"),
          (state.messages = [...state.messages, action.payload]);
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
      })
      .addCase(sendMessageToUser.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      });
  },
});

export const {} = chatSlice.actions;

export default chatSlice.reducer;
