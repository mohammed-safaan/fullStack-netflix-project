import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, deleteFavMovie } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import { FaCaretSquareRight, FaPlus, FaTrashAlt } from "react-icons/fa";

const WatchlistItem = ({ mvId, setFavMoviesArr }) => {
  const [movie, setMovie] = useState();

  const { token } = useSelector(authSelector);
  const dispatch = useDispatch();

  const deleteMovie = () => {
    dispatch(deleteFavMovie(mvId));
    setFavMoviesArr((prev) => prev.filter((ele) => ele !== mvId));
  };

  const getMovie = async () => {
    const url = "http://localhost:8800/api/movies/find/" + mvId;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `Bearers ${token}`,
        },
      });
      setMovie(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <div className="movie-body">
      {movie && (
        <>
          <div
            className="movie-card "
            style={{ backgroundImage: `url(${movie?.img})` }}
          >
            <div className="btn-container">
              <Button className="btn">
                <Link to="/watch" state={{ movie: movie }}>
                  <FaCaretSquareRight />
                </Link>
              </Button>
              <Button className="btn text-white">
                <FaTrashAlt
                  onClick={() => {
                    deleteMovie();
                  }}
                />
              </Button>
            </div>
          </div>
          <h5>{movie?.title}</h5>
        </>
      )}
    </div>
  );
};

export default WatchlistItem;
