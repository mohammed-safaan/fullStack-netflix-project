import "./App.scss";
import Home from "./pages/home/Home";
import Catalog from "./pages/catalog/Catalog";
import Register from "./pages/register/Register";
import Watch from "./pages/watch/Watch";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import UsersCards from "./pages/dashboard/users/UsersCards";
import UserForm from "./pages/dashboard/users/UserForm";
import MoviesCards from "./pages/dashboard/movies/MoviesCards";
import AddMovie from "./pages/dashboard/movies/AddMovie";
import Profile from "./pages/profile/Profile";
import Signup from "./pages/signup/Signup";
import Watchlist from "./pages/watchlist/watchlist";
import Plans from "./pages/subscription/Plans";
import ErrorPage from "./pages/error/ErrorPage";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { authSelector } from "./features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import {getUserData} from "./features/profile/profileSlice"
function App() {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const [subscription_status, setSubscription_status] = useState("");
  const id = JSON.parse(localStorage.getItem("id"));
  const dispatch = useDispatch();
  const userdata = useSelector((state) => state.userData.value);
  const status = useSelector((state) => state.userData.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getUserData(id));
    }
    if (status === "success") {
      setSubscription_status(userdata.subscription_status)
      console.log(subscription_status,"subscription_status")
    }
    setToken(JSON.parse(localStorage.getItem("token")));
  }, [token,dispatch,status,id,subscription_status]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            token ? <Home setToken={setToken} /> : <Navigate to="/register" />
          }
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={
            !token ? <Login setToken={setToken} /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/home" />}
        />
        <Route
          path="/catalog/:type"
          element={token ? <Catalog /> : <Navigate to="/register" />}
        />
        <Route
          path="/watch"
          element={(token && subscription_status) === ("trialing"||"active") ?
            <Watch /> : token && subscription_status === "" ?
            <Navigate to="/subscription" />: <Navigate to="/register" />}
        />
        <Route
          path="/watchlist"
          element={token ? <Watchlist /> : <Navigate to="/register" />}
        />
        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/register" />}
        />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/register" />}
        >
          <Route
            path="users"
            element={token ? <UsersCards /> : <Navigate to="/register" />}
          />
          <Route
            path="users/:id"
            element={token ? <UserForm /> : <Navigate to="/register" />}
          />
          <Route
            path="movies"
            element={token ? <MoviesCards /> : <Navigate to="/register" />}
          />
          <Route
            path="movies/:id"
            element={
              token ? <AddMovie type={"update"} /> : <Navigate to="/register" />
            }
          />
          <Route
            path="addmovie"
            element={
              token ? <AddMovie type={"add"} /> : <Navigate to="/register" />
            }
          />
        </Route>
        <Route
          path="/subscription"
          element={token ? <Plans /> : <Navigate to="/register" />}
        />
        {/* Error Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
