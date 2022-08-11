import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import allMoviesReducer from "../features/dashboard/moviesSlice";
import allUsersReducer from "../features/dashboard/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userData: profileReducer,
    allMovies: allMoviesReducer,
    allUsers: allUsersReducer,
  },
});
