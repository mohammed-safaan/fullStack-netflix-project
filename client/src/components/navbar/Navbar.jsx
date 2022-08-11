import { ArrowDropDown } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import axios from "axios";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
// **
import Dropdown from "react-bootstrap/Dropdown";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ setToken }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState({});
  const [ismobile, setIsmobile] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = JSON.parse(localStorage.getItem("id"));
  const token = JSON.parse(localStorage.getItem("token"));

  const getUserData = async (id, token) => {
    const url = `http://localhost:8800/api/users/find/${id}`;

    try {
      const res = await axios.get(url, {
        headers: {
          token: `Bearers ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData(id, token);
  }, [id, token]);

  const onLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/register");
    }, 500);
  };

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <div className="navbr">
      <div className="contaner">
        <div className="left">
          <Link to="/" className="link">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className={ismobile ? "activ center" : "center"}>
          <Link to="/" className="link">
            <span>HomePage</span>
          </Link>
          <Link to="/catalog/movies" className="link">
            <span>Movies</span>
          </Link>
          <Link to="/catalog/series" className="link">
            <span>Series</span>
          </Link>
          <Link to="/watchlist">
            <span>MyFavourite List</span>
          </Link>
        </div>
        {/*  */}

        <div className="right">
          <Dropdown className="dropdown-nav">
            <Dropdown.Toggle id="dropdown-basic">
              <img src={user?.profilePic} alt="user picture" />
              <span>{user?.username}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark">
              <Dropdown.Item className="bg-dark">
                <Link to="/profile">
                  <span>Account</span>
                </Link>
              </Dropdown.Item>
              {user?.isAdmin && (
                <Dropdown.Item className="bg-dark">
                  <Link to="/dashboard/users">
                    <span>Dashboard</span>
                  </Link>
                </Dropdown.Item>
              )}

              <Dropdown.Item className="bg-dark">
                <span onClick={onLogout}>Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-lg-none">
          {ismobile ? (
            <FaTimes
              className="nav-icon fs-2"
              onClick={() => setIsmobile(false)}
            />
          ) : (
            <FaBars
              className="nav-icon fs-2"
              onClick={() => setIsmobile(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;