import React, { useState, useEffect, useCallback } from "react";
import SpinnerRoundOutlined from "react-spinners/ClipLoader";
import "./movie-grid.scss";
import Input from "../input/Input";
import MovieCard from "../movie-card/MovieCard";
import Button from "../button/Button";
import axios from "axios";

const MovieGrid = (props) => {
  const { type } = props;
  const [moviesandseries, setMoviesAndSeries] = useState([]);
  const [genre, setGenre] = useState("");
  const [pagedetails, setPageDetails] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [bgActive, setBgActive] = useState(false);
  let totalpages = pagedetails.totalPages;
  let [loading, setLoading] = useState("");

  useEffect(() => {
    const getMovieOrSeries = async () => {
      setLoading(false);
      const url = `http://localhost:8800/api/movies/filter${
        type ? `?type=${type}` : ""
      }${genre ? `&genre=${genre}` : ""}${page ? `&page=${page}` : ""}${
        search ? `&search=${search}` : ""
      }`;

      try {
        const res = await axios.get(url, {
          headers: {
            token:
              "Bearers eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU4NGQ5MTQ3MDkwNTdhYzZmZjU0NSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NTk3OTg4ODMsImV4cCI6MTY2NDExODg4M30.MtFf9CekArm08BKokr2InDdYfVwOllsemxC28sIlisE",
          },
        });

        setMoviesAndSeries(res.data.data);
        setLoading(true);
        if (res.data.data.length == 0) {
          setPageDetails({});
        } else {
          setPageDetails(res.data.paging);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMovieOrSeries();
  }, [type, genre, page, search]);

  let changebackground = (ele) => {
    ele.classList.add("activ");
  };

  let loopfun = () => {
    let output = [];
    for (let index = 1; index < totalpages + 1; index++) {
      output.push(
        <li key={index} onClick={() => (setPage(index), setBgActive(true))}>
          {" "}
          <a
            href="#typemovie"
            className={
              index === page
                ? "activ page-link text-dark"
                : "page-link text-dark"
            }
          >
            {index}
          </a>
        </li>
      );
    }

    return output;
  };

  let incrementfun = () => {
    if (page < 5) {
      setPage(page + 1);
    } else {
      setPage(5);
    }
  };

  let decrementfun = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      setPage(1);
    }
  };

  return (
    <>
      <div className="section mb-3 d-flex justify-content-around align-items-center justify-content-center flex-wrap">
        <div className="movie-search mb-3">
          <Input
            type="text"
            className=""
            placeholder="Enter movie title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="category">
          <span className="text-white fs-3 mr-2">Type : </span>
          <select
            name="genre"
            id="genre"
            className="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All</option>
            <option value="Comedy">Comedy</option>
            <option value="Crime">Crime</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Romance">Romance</option>
            <option value="Animation">Animation</option>
            <option value="Drama">Drama</option>
            <option value="Action">Action</option>
          </select>
        </div>
      </div>
      {loading ? (
        <>
          <div className="movie-grid mt-5">
            {moviesandseries.length > 0 ? (
              moviesandseries.map((item, i) => (
                <MovieCard item={item} key={i} />
              ))
            ) : (
              <p className="noresult fz-5">No Results</p>
            )}
          </div>
          <nav
            aria-label="Page navigation example"
            className={
              moviesandseries.length > 0
                ? "d-flex justify-content-center"
                : "d-none"
            }
          >
            <ul className="pagination text-dark ">
              <li className="page-item" onClick={() => decrementfun()}>
                <a
                  className="page-link text-dark"
                  aria-label="Previous"
                  href="#typemovie"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>

              {loopfun()}

              <li className="page-item" onClick={() => incrementfun()}>
                <a
                  className="page-link text-dark"
                  aria-label="Next"
                  href="#typemovie"
                >
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <p className="spinnerbtn text-center mt-5 text-danger">
          <SpinnerRoundOutlined
            size={100}
            thickness={100}
            speed={167}
            color="rgba(255, 255, 255, 0.70)"
          />
        </p>
      )}
    </>
  );
};

export default MovieGrid;
