import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import MovieCard from "../../components/movie-card/MovieCard";
import Navbar from "../../components/navbar/Navbar";
import Container from "react-bootstrap/Container";
import "./watchlist.scss";

const Watchlist = () => {
  const [user, setUser] = useState();
  const [rerender, setRerender] = useState(false);
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
    console.log(rerender);
    getUserData(id, token);
    setRerender(false);
  }, [rerender]);
  return (
    <div>
      <Navbar />
      <div className="watchlist">
        <h2 className="text-center catehead">Favourite Movies</h2>

        {user && user.favMovies.length !== 0 ? (
          <div className="movie-grid mt-5">
            {user.favMovies.map((ele, indx) => (
              <MovieCard
                key={indx}
                movieId={ele}
                dist="favourite"
                rerender={setRerender}
              />
            ))}
          </div>
        ) : (
          <h3 className="text-center">No Movies Added</h3>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Watchlist;
