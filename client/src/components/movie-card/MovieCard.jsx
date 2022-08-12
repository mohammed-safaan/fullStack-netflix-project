import React, { useEffect, useState } from "react";
import "./movie-card.scss";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import { FaCaretSquareRight, FaPlus, FaTrashAlt } from "react-icons/fa";

import { useDispatch } from "react-redux";
import { deleteFavMovie, addFavMovie } from "../../features/auth/authSlice";

const MovieCard = (props) => {
  const item = props?.item;
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();

  //
  const handleAddedMovies = (movie) => {
    dispatch(addFavMovie(movie));
    setIsAdded(true);
  };
  const handleRemovedMovies = (movie) => {
    dispatch(deleteFavMovie(movie));
    setIsAdded(false);
  };

  //

  // *****

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
          <h5>{item?.title}</h5>
        </>
      )}
    </div>
  );
};

export default MovieCard;
