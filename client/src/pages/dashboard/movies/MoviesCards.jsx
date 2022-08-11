import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllMovies,
  deleteMovie,
} from "../../../features/dashboard/moviesSlice";
export default function MoviesCards() {
  const [page, setPage] = useState(1);
  const [pagedetails, setPageDetails] = useState({});

  const movieDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allMovies = useSelector((state) => state.allMovies.value.data);
  const paging = useSelector((state) => state.allMovies.value.paging);

  useEffect(() => {
    dispatch(getAllMovies(page));
  }, [dispatch, page]);

  const loopfun = () => {
    let output = [];
    for (let index = 1; index < paging.totalPages + 1; index++) {
      output.push(
        <li key={index} onClick={() => setPage(index)}>
          {" "}
          <a
            className={
              page === index
                ? "bg-danger page-link text-light"
                : "bg-dark page-link text-light"
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
    if (page < paging.totalPages) {
      setPage(page + 1);
    } else {
      setPage(paging.totalPages);
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
      {allMovies && (
        <>
          {allMovies.map((ele, index) => (
            <Col key={index} sm={12} md={12} lg={6} className="">
              <Card className="bg-dark text-white">
                {/* <Card.Img src={ele.imgSm} alt="Card image" className="" /> */}
                <Card.Body className="p-0 d-flex flex-column justify-content-between">
                  <div className="p-3 movie-info">
                    <Card.Title className="fw-bold">{ele.title}</Card.Title>
                    <Card.Text>Added in :{movieDate(ele.createdAt)}</Card.Text>
                  </div>
                  <div className="card-icon card-footer bg-dark d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("" + ele._id);
                      }}
                    >
                      Edit
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(deleteMovie(ele._id));
                        dispatch(getAllMovies(page));
                      }}
                    >
                      Delete
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <nav
            aria-label="Page navigation example"
            className="d-flex justify-content-center"
          >
            <ul className="pagination text-light bg-dark">
              <li className="page-item" onClick={() => decrementfun()}>
                <a
                  className="page-link text-light bg-dark"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>

              {loopfun()}

              <li className="page-item" onClick={() => incrementfun()}>
                <a className="page-link text-light bg-dark" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
