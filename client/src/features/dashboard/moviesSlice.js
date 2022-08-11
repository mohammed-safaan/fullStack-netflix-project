import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const id = JSON.parse(localStorage.getItem("id"));
const token = JSON.parse(localStorage.getItem("token"));

export const getAllMovies = createAsyncThunk(
  "dashboard/getAllMovies",
  async (page) => {
    const response = await axios.get(
      `http://localhost:8800/api/movies?page=${page}`,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);
export const getMovieData = createAsyncThunk(
  "dashboard/getMovieData",
  async (id) => {
    const response = await axios.get(
      "http://localhost:8800/api/movies/find/" + id,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);

export const updateMovie = createAsyncThunk(
  "dashboard/updateMovie",
  async ({ id, formData }) => {
    console.log("changedData from slice", formData);
    console.log("changedData from slice", id);
    try {
      const response = await axios.put(
        "http://localhost:8800/api/movies/" + id,
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

export const deleteMovie = createAsyncThunk(
  "dashboard/deleteMovie",
  async (id) => {
    const response = await axios.delete(
      "http://localhost:8800/api/movies/" + id,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);

export const createMovie = createAsyncThunk(
  "dashboard/createMovie",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:8800/api/movies/",
      formData,
      {
        headers: {
          token: "Bearers " + token,
        },
      
      }
    );
    return response.data;
  }
);

export const allMovies = createSlice({
  name: "allMovies",
  initialState: {
    value: [],
    status: "idle",
    singleStatus: "idle",
    error: null,
    deleteMsg: "",
    singleMovie: {},
    newMovie: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllMovies.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = "success";
      })
      .addCase(getAllMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.deleteMsg = action.payload;
      })
      .addCase(getMovieData.pending, (state) => {
        state.singleStatus = "loading";
      })
      .addCase(getMovieData.fulfilled, (state, action) => {
        state.singleMovie = action.payload;
        state.singleStatus = "success";
      })
      .addCase(getMovieData.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.updateData = action.payload;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.newData = action.payload;
      });
  },
});
export default allMovies.reducer;
