import axios from "axios";

// register
const register = async (userData) => {
  const response = await axios.post(
    "http://localhost:8800/api/auth/register",
    userData
  );
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// login
const login = async (userData, thunkApi) => {
  const response = await axios.post(
    "http://localhost:8800/api/auth/login",
    userData
  );

  // console.log("response", response.data);
  if (response.data?.message === "Done") {
    localStorage.setItem("token", JSON.stringify(response.data.token));
    localStorage.setItem("id", JSON.stringify(response.data._id));
    localStorage.setItem("subscription_status", JSON.stringify(response.data.subscription_status));
    return response.data;
  } else {
    return thunkApi.rejectWithValue(response.data);
  }
};

// logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
};
const authService = {
  register,
  logout,
  login,
};

export default authService;
