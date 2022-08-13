import { useState, useEffect } from "react";
import "./listitem.scss";
import { FaCaretSquareRight, FaPlus, FaTrashAlt } from "react-icons/fa";

import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteFavMovie, addFavMovie } from "../../features/auth/authSlice";

const ListItem = ({ index, item }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, isSetHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const dispatch = useDispatch();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const token = JSON.parse(localStorage.getItem("token"));
  const id = JSON.parse(localStorage.getItem("id"));

  const handleAddedMovies = (movie) => {
    dispatch(addFavMovie(movie));
    setIsAdded(true);
  };
  const handleRemovedMovies = (movie) => {
    dispatch(deleteFavMovie(movie));
    setIsAdded(false);
  };

  // ****

  const getMovie = async () => {
    const url = "http://localhost:8800/api/movies/find/" + item;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `Bearers ${token}`,
        },
        cancelToken: source.token,
      });
      setMovie(res.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("successfully aborted");
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getMovie();
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    };
  }, [item]);

  return (
    <div
      className="listitem"
      onMouseEnter={() => isSetHovered(true)}
      onMouseLeave={() => isSetHovered(false)}
      style={{ left: isHovered && index * 250 - 50 + index * 2.5 }}
    >
      {!isHovered && <img src={movie?.img} alt="" />}
      <Link to="/watch" state={{ movie }}>
      {!isHovered && <p className="text-center">{movie?.title}</p>}
  </Link>

      {isHovered && (
        <>
          <iframe
            src={`https://www.youtube.com/embed/${movie?.video}?controls=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="itemInfo">
            <div className="icons">
              <Link to="/watch" state={{ movie }}>
                <FaCaretSquareRight />
              </Link>

              {isAdded ? (
                <FaTrashAlt
                  style={{ color: "red" }}
                  onClick={() => {
                    handleRemovedMovies(item);
                  }}
                />
              ) : (
                <FaPlus
                  onClick={() => {
                    handleAddedMovies(item);
                  }}
                />
              )}
            </div>
            <div className="itemInfoTop">
              <span>{movie.duration}</span>
              <span>{movie.year}</span>
              <div className="genre">{movie.genre}</div>
            </div>
            <div className="desc">{movie.desc}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItem;
