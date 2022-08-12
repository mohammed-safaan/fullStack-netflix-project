import React, { useRef, useEffect, useState } from "react";
import "./watch.scss";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";

import SpinnerRoundOutlined from "react-spinners/ClipLoader";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import MovieCard from "../../components/movie-card/MovieCard";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/containers/Footer";
import Comments from "../../components/comments/Comments";

const Watch = () => {
  const location = useLocation();
  const movie = location.state.movie;
  const iframeRef = useRef(null);

  const type = movie.isSeries ? "series" : "movies";
  const [similarmovies, setSimilarMovies] = useState([]);
  let slicesimilarmovies = similarmovies.slice(0, 10);

  const token = JSON.parse(localStorage.getItem("token"));

  // get similar movie
  const getMovieOrSeries = async () => {
    const url = `http://localhost:8800/api/movies/filter${
      type ? `?type=${type}` : ""
    }${movie.genre ? `&genre=${movie.genre}` : ""}`;
    console.log(url);
    try {
      const res = await axios.get(url, {
        headers: {
          token: "Bearers " + token,
        },
      });
      setSimilarMovies(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const height = (iframeRef.current.offsetWidth * 9) / 16 + "px";
    iframeRef.current.setAttribute("height", height);
  }, []);

  useEffect(() => {
    getMovieOrSeries();
    return () => {};
  }, [type, movie.genre, movie]);

  return (
    <div className="watch">
      <Navbar />

      {movie && (
        <>
          <div
            className="banner"
            style={{ backgroundImage: movie.imgSm }}
          ></div>
          <div className="mb-3 movie-content container align-items-center">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{ backgroundImage: `url(${movie.img})` }}
              ></div>
            </div>
            <div className="movie-content__info">
              <h1 className="title">{movie.title || movie.name}</h1>
              <div className="genres">
                <span className="genres__item">{movie.genre}</span>
              </div>
              <p className="overview">{movie.desc}</p>
              <p className="overview">{movie.year}</p>
              {/* <div className="movie-content__comments mb-0">
                <Comments movieId={movie._id} />
              </div> */}
            </div>
          </div>

          <div className="container">
            <div className="section mb-3">
              <div className="video">
                <div className="video__title">
                  <h2>{movie.name}</h2>
                </div>
                <iframe
                  src={`https://www.youtube.com/embed/${movie.video}?controls=1`}
                  ref={iframeRef}
                  width="100%"
                  height="315"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="comments">
                   <Comments movieId={movie._id} />
              </div>
            </div>

            <div className="section mb-3">
              <div className="section__header mb-2">
                <h2 className="text-center m-5">Similar Movies</h2>
              </div>
              <div className="movieswiper text-center ">
                <Swiper spaceBetween={50} slidesPerView={"auto"}>
                  {slicesimilarmovies.length > 0 ? (
                    slicesimilarmovies.map((movie, indx) => {
                      return (
                        <SwiperSlide key={indx}>
                          <MovieCard item={movie} />
                        </SwiperSlide>
                      );
                    })
                  ) : (
                    <p className="text-white text-center mt-3">
                      <SpinnerRoundOutlined
                        size={100}
                        thickness={100}
                        speed={167}
                        color="rgba(255, 255, 255, 0.70)"
                      />
                    </p>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Watch;
