import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"));
const status = JSON.parse(localStorage.getItem("subscription_status"));
// console.log(token)
export const getUserData = createAsyncThunk(
  "profile/getUserData",
  async (userId) => {
    const response = await axios.get(
      "http://localhost:8800/api/users/find/" + userId,
      {
        headers: {
          token: "Bearers " + token,
        },
      }
    );
    return response.data;
  }
);

export const getSubStatus = createAsyncThunk(
  "profile/getSubStatus",
  async (userId) => {
    const response = await axios.get(
      "http://localhost:8800/api/users/find/" + userId,
      {
        headers: {
          token: "Bearers " + token,
        },
      }
    );
    localStorage.setItem(
      "subscription_status",
      JSON.stringify(response.data.subscription_status)
    );
    return response.data.subscription_status;
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, changedData }) => {
    try {
      const response = await axios.put(
        `http://localhost:8800/api/users/${userId}`,
        changedData,
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
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    value: {},
    status: "idle",
    updateData: "",
    subStatus: status,
    loadingSubStatus: "idle",
    subError: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = "success";
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateData = action.payload;
      })
      .addCase(getSubStatus.pending, (state) => {
        state.loadingSubStatus = "loading";
      })
      .addCase(getSubStatus.fulfilled, (state, action) => {
        state.subStatus = action.payload;
        state.loadingSubStatus = "success";
      })
      .addCase(getSubStatus.rejected, (state, action) => {
        state.loadingSubStatus = "failed";
        state.subError = action.error.message;
      });
  },
});
export default profileSlice.reducer;
