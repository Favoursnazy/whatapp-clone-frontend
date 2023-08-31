import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_END_POINT } from "../utils/constants";
import Axios from "../api/Axios";

const initialState = {
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",
  },
  status: "",
  error: "",
};

export const registerUser = createAsyncThunk(
  "auth/regsiter",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`${AUTH_END_POINT}/register`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`${AUTH_END_POINT}/login`, {
        ...values,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      (state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
      }),
        (state.status = ""),
        (state.error = "");
    },
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
    autoLogin: (state, action) => {
      state.status = "succeeded";
      state.error = "";
      state.user = action.payload.user;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload);
      });
  },
});

export const { logout, changeStatus, autoLogin, updateSocket } =
  userSlice.actions;

export default userSlice.reducer;
