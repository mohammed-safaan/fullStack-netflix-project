import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"));


export const getAllUsers = createAsyncThunk(
  "dashboard/getAllUsers",
  async () => {
    const response = await axios.get("http://localhost:8800/api/users", {
      headers: {
          token: "Bearers " + token,
        },
      
    });
    return response.data;
  }
);
export const getUserData = createAsyncThunk(
  "dashboard/getUserData",
  async (id) => {
    const response = await axios.get(
      "http://localhost:8800/api/users/find/" + id,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "dashboard/updateUser",
  async ({ id, formData }) => {
    console.log("changedData from slice", formData);
    console.log("changedData from slice", id);
    try {
      const response = await axios.put(
        "http://localhost:8800/api/users/" + id,
        formData,
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

export const deleteUser = createAsyncThunk(
  "dashboard/deleteUser",
  async (id) => {
    const response = await axios.delete(
      "http://localhost:8800/api/users/" + id,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);

export const allUsers = createSlice({
  name: "allUsers",
  initialState: {
    value: [],
    status: "idle",
    error: null,
    deleteMsg: "",
    singleUser: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = "success";
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteMsg = action.payload;
      })
      .addCase(getUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.singleUser = action.payload;
        state.status = "success";
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateData = action.payload;
      });
  },
});
export default allUsers.reducer;
