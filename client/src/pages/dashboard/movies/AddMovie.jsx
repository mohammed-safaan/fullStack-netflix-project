import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../../firebaseConfig";
import { nanoid } from "@reduxjs/toolkit";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMovieData,
  createMovie,
  updateMovie,
} from "../../../features/dashboard/moviesSlice";

export default function AddMovie({ type }) {
  const [items, setItems] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const movieData = useSelector((state) => state.allMovies.singleMovie);
  const status = useSelector((state) => state.allMovies.singleStatus);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (type === "update") {
      if (status === "idle") {
        dispatch(getMovieData(id));
      }
      if (status === "success") {
        setFormData({
          ...movieData,
        });
      }
    } else {
      setFormData({});
    }
  }, [dispatch, status, type]);

  const handleChange = (value) => {
    setFormData({ ...formData, ...value });
    console.log("onChange", formData);
  };
  const handleFiles = (e) => {
    setItems((prev) => [
      ...prev,
      { name: e.target.name, file: e.target.files[0] },
    ]);
  };
  const handleSubmit = (e) => {
    if (uploaded !== 5 && type === "add") {
      e.preventDefault();
      e.stopPropagation();
    }
    // e.preventDefault();
    if (type === "add") {
      dispatch(createMovie(formData));
    } else {
      dispatch(updateMovie({ id, formData }));
    }
  };
  const handleUpload = (items) => {
    items.forEach((item) => {
      const storageRef = ref(storage, "moviesData/" + item.name + nanoid());
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is runninggg");
              break;
            default:
              console.log("not uploading");
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prev) => {
              return { ...prev, ...{ [item.name]: downloadURL } };
            });
            setUploaded((prev) => prev + 1);
            console.log(uploaded);
            console.log("File available at", downloadURL);
          });
        }
      );
    });
  };

  return (
    <>
      <Col>
        <Form
          className="movieForm"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <Row>
            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="text"
                  value={formData.title || ""}
                  placeholder="Title"
                  onChange={(e) => {
                    handleChange({ title: e.target.value });
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="text"
                  value={formData.desc || ""}
                  placeholder="Description"
                  onChange={(e) => {
                    handleChange({ desc: e.target.value });
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="gener">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="text"
                  value={formData.genre || ""}
                  placeholder="Genre"
                  onChange={(e) => {
                    handleChange({ genre: e.target.value });
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="text"
                  value={formData.year || ""}
                  placeholder="year"
                  onChange={(e) => {
                    handleChange({ year: e.target.value });
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              <Form.Group controlId="isSeries">
                <Form.Label>Is Series?</Form.Label>
                <Form.Select
                  required={type === "add" ? true : false}
                  value={formData.isSeries || ""}
                  aria-label="Is Series?"
                  onChange={(e) => {
                    handleChange({ isSeries: Boolean(e.target.value) });
                  }}
                >
                  <option value="">No</option>
                  <option value="true">Yes</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="file"
                  name="img"
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="titleImage">
                <Form.Label>Image Title</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="file"
                  name="imgTitle"
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="thumpnailImage">
                <Form.Label>Thumbnail Image</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="file"
                  name="imgSm"
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="trailer">
                <Form.Label>Trailer</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="file"
                  name="trailer"
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              <Form.Group className="mb-3" controlId="video">
                <Form.Label>Video</Form.Label>
                <Form.Control
                  required={type === "add" ? true : false}
                  type="file"
                  name="video"
                  onChange={(e) => {
                    handleFiles(e);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={12} lg={6} xl={4}>
              {(items.length === 5) & (uploaded !== 5) ? (
                <p
                  className="alert alert-dark"
                  onClick={() => {
                    console.log(uploaded);
                  }}
                >
                  Click upload and wait till your files uploaded
                </p>
              ) : (items.length === 5) & (uploaded === 5) ? (
                <p className="alert alert-dark">Your files are ready</p>
              ) : (
                <></>
              )}
            </Col>
          </Row>
          {(items.length === 5) & (uploaded !== 5) ? (
            <Button
              className="updateBtn"
              variant="primary"
              type="button"
              onClick={() => {
                if (items.length === 5) {
                  handleUpload(items);
                }
              }}
            >
              Upload first
            </Button>
          ) : !id ? (
            <Button className="updateBtn" variant="secondry" type="submit">
              create
            </Button>
          ) : (
            <></>
          )}

          {type === "update" && (
            <>
              {items.length === 0 && (
                <Button
                  className="ms-2 updateBtn"
                  variant="secondry"
                  type="submit"
                >
                  update
                </Button>
              )}
              {items.length !== 0 && (
                <Button
                  className="updateBtn"
                  variant="primary"
                  type="button"
                  onClick={() => {
                    handleUpload(items);
                    setItems([]);
                  }}
                >
                  Upload first
                </Button>
              )}
              <Button
                className="ms-2 btn-secondary"
                variant="secondry"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              {/* <Button
                className="ms-2 btn-secondary"
                variant="secondry"
                type="button"
                onClick={() => {
                  console.log("formData", formData);
                  console.log(items.length);
                }}
              >
                test
              </Button> */}
            </>
          )}
        </Form>
      </Col>
    </>
  );
}
