import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import authService from "./authService";

// Get user from localstorage
const user = JSON.parse(localStorage.getItem("token"));
//
const id = JSON.parse(localStorage.getItem("id"));
const token = JSON.parse(localStorage.getItem("token"));

const initialState = {
  user: user ? user : "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// helper

const getUserInfo = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8800/api/users/find/" + id,
      {
        headers: {
          token: "Bearers " + token,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkApi) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

// Login User
export const login = createAsyncThunk("auth/login", async (user, thunkApi) => {
  try {
    return await authService.login(user, thunkApi);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

// Add movie user data

export const addFavMovie = createAsyncThunk(
  "auth/addFavMovie",
  async (movieId) => {
    try {
      const data = await getUserInfo();
      let prevFav = data.favMovies;
      prevFav.push(movieId);
      console.log(prevFav);
      await axios.put(
        `http://localhost:8800/api/users/${id}`,
        { favMovies: prevFav },
        {
          headers: {
            token: "Bearers " + token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

// Delete movie user data

export const deleteFavMovie = createAsyncThunk(
  "auth/deleteFavMovie",
  async (movieId) => {
    try {
      const data = await getUserInfo();
      let prevFav = data.favMovies;
      const filtered = prevFav.filter((ele) => ele !== movieId);
      console.log(filtered);
      await axios.put(
        `http://localhost:8800/api/users/${id}`,
        { favMovies: filtered },
        {
          headers: {
            token: "Bearers " + token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", () => {
  authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // reset the initial state after login
    reset: (state) => {
      state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
      return state;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = "";
      state.user = payload;

      return state;
    },
    [login.rejected]: (state, { payload }) => {
      console.log("payload", payload);
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    },
    [login.pending]: (state) => {
      state.isLoading = true;
    },
    [logout.fulfilled]: (state) => {
      state.user = null;
    },
  },
});

// ***
export const authSelector = (state) => state.auth;
// ***
export const { reset } = authSlice.actions;
export default authSlice.reducer;
