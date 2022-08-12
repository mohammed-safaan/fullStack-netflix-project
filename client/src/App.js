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
import ErrorPage from "./pages/error/ErrorPage";
import { Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authSelector } from "./features/auth/authSlice";
import { useSelector } from "react-redux";
import Planspage from "./pages/subscription/Plans";
function App() {
  const { token } = useSelector(authSelector);
  const subscription_status = useSelector((state) => state.userData.subStatus);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/register" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" />}
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
          element={
            (token && subscription_status) === ("trialing" || "active") ? (
              <Watch />
            ) : token && subscription_status === "" ? (
              <Navigate to="/subscription" />
            ) : (
              <Navigate to="/register" />
            )
          }
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
          element={token ? <Planspage /> : <Navigate to="/register" />}
        />
        {/* Error Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
