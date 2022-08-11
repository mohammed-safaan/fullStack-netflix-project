import React, { useEffect, useState } from "react";
import "./movie-card.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { FaCaretSquareRight, FaPlus, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteFavMovie, addFavMovie } from "../../features/auth/authSlice";

const MovieCard = (props) => {
  const [item, setItem] = useState(props?.item);
  const [isAdded, setIsAdded] = useState(true);
  const dispatch = useDispatch();
  const movieId = props?.movieId;
  const dist = props?.dist;
  const token = JSON.parse(localStorage.getItem("token"));
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const setRerender = props?.rerender;

  //
  const handleAddedMovies = (movie) => {
    dispatch(addFavMovie(movie));
    setIsAdded(true);
    setRerender(true);
  };
  const handleRemovedMovies = (movie) => {
    dispatch(deleteFavMovie(movie));
    setIsAdded(false);
    setRerender(true);
  };

  //

  // *****

  const getMovie = async () => {
    const url = "http://localhost:8800/api/movies/find/" + movieId;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `Bearers ${token}`,
        },
        cancelToken: source.token,
      });
      setItem(res.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("successfully aborted");
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (dist === "favourite") {
      getMovie();
    }
  }, [isAdded]);

  return (
    <div className="movie-body">
      {item && (
        <>
          <div
            className="movie-card "
            style={{ backgroundImage: `url(${item?.img})` }}
          >
            <Button className="btn">
              <Link to="/watch" state={{ movie: item }}>
                <FaCaretSquareRight />
              </Link>
            </Button>
            <Button className="btn btnlike mt-5 btn text-white">
              {isAdded ? (
                <FaTrashAlt
                  onClick={() => {
                    handleRemovedMovies(item._id);
                  }}
                />
              ) : (
                <FaPlus
                  onClick={() => {
                    handleAddedMovies(item._id);
                  }}
                />
              )}
            </Button>
          </div>
          <h5>{item?.title || item?.name}</h5>
        </>
      )}
    </div>
  );
};

export default MovieCard;
