import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CONVERSATION_END_POINT, MESSAGES_ENDPOINT } from "../utils/constants";
import Axios from "../api/Axios";

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  notifications: [],
  messages: [],
  files: [],
};

// GET ALL CONVERSTION
export const getConversation = createAsyncThunk(
  "conversation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(CONVERSATION_END_POINT, {
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
    const { token, reciever_id, isGroup, convo_id, unreadMessages } = values;
    try {
      const { data } = await Axios.post(
        CONVERSATION_END_POINT,
        { reciever_id, isGroup, convo_id, unreadMessages },
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
      const { data } = await Axios.get(`${MESSAGES_ENDPOINT}/${convo_id}`, {
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

// SEND MESSAGE TO USER
export const sendMessageToUser = createAsyncThunk(
  "conversation/send_message",
  async (values, { rejectWithValue }) => {
    const { token, convo_id, message, files, voice } = values;
    try {
      const { data } = await Axios.post(
        MESSAGES_ENDPOINT,
        { message, convo_id, files, voice },
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

// CREATE GROUP CONVERSATION
export const createGroupConversation = createAsyncThunk(
  "conversation/group_conversation",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      const { data } = await Axios.post(
        `${CONVERSATION_END_POINT}/group`,
        { name, users },
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
    updateMessageAndConversation: (state, action) => {
      //update messages
      let convo = state.activeConversation;
      if (convo._id === action.payload.newMessage.conversation._id) {
        state.messages = [...state.messages, action.payload.newMessage];
      }

      //update conversations
      let conversation = {
        ...action.payload.newMessage.conversation,
        latestMessage: action.payload.newMessage,
        unreadMessages:
          convo._id === action.payload.newMessage.conversation._id
            ? 0
            : action.payload.totalUnreadMessage,
      };

      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    clearFiles: (state, action) => {
      state.files = [];
    },
    removeFileFromFiles: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },
    clearUnreadMessages: (state, action) => {
      let conversation = state.conversations;
      conversation.map((convo) => {
        if (convo._id === action.payload) {
          convo.unreadMessages = 0;
        }
      });
    },
    updateReadMessage: (state, action) => {
      const conversation = state.conversations;
      const messages = state.messages;
      conversation.map((convo) => {
        if (convo._id === action.payload._id) {
          convo.latestMessage = action.payload.latestMessage;
        }
      });
      messages.map((msg) => {
        if (msg._id === action.payload.latestMessage._id) {
          msg.status = "read";
        }
      });
    },
    clearMessageAndActiveConvo: (state, action) => {
      state.messages = [];
      state.activeConversation = {};
    },
    updateActiveConvoMessage: (state, action) => {
      let message = state.messages;
      let convos = state.conversations;
      message.map((msg) => {
        if (msg._id === action.payload._id) {
          msg.status = "read";
        }
      });
      convos.map((convo) => {
        if (convo._id === action.payload.conversation._id) {
          convo.latestMessage.status = "read";
        }
      });
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
          (state.activeConversation = action.payload),
          (state.files = []);
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
          (state.messages = [...state.messages, action.payload.message]);
        let conversation = {
          ...action.payload.message.conversation,
          latestMessage: action.payload.message,
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

export const {
  updateMessageAndConversation,
  addFiles,
  setActiveConversation,
  clearFiles,
  removeFileFromFiles,
  clearUnreadMessages,
  updateReadMessage,
  clearMessageAndActiveConvo,
  updateActiveConvoMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
