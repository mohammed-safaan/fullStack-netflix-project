import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieCard from "../../components/movie-card/MovieCard";
import Navbar from "../../components/navbar/Navbar";
import "./watchlist.scss";

const Watchlist = () => {
  const id = JSON.parse(localStorage.getItem("id"));
  const token = JSON.parse(localStorage.getItem("token"));
  const [favMoviesArr, setFavMoviesArr] = useState([]);

  const getUserData = async () => {
    const url = `http://localhost:8800/api/users/find/${id}`;

    try {
      const res = await axios.get(url, {
        headers: {
          token: `Bearers ${token}`,
        },
      });

      setFavMoviesArr(res.data.favMovies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [favMoviesArr]);
  return (
    <div>
      <Navbar />
      <div className="watchlist">
        <h2 className="text-center catehead">Favourite Movies</h2>

        {favMoviesArr.length !== 0 ? (
          <div className="movies-cont movie-grid mt-5">
            {favMoviesArr.map((ele, indx) => (
              <MovieCard key={indx} mvId={ele} />
            ))}
          </div>
        ) : (
          <h3 className="text-center text-white">No Movies Added</h3>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
