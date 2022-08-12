import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from "../../firebaseConfig";
import { useSelector, useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import {
  getUserData,
  updateUserProfile,
} from "../../features/profile/profileSlice";
import { Card, Row, Container, Form } from "react-bootstrap";
import "./profile.scss";
import { useNavigate} from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/containers/Footer";

const Profile = () => {
  const userId = JSON.parse(localStorage.getItem("id"));

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userData.value);
  const status = useSelector((state) => state.userData.status);
  // const updateData = useSelector((state) => state.userData.updateData);

  const [changedData, setChangedData] = useState({});
  const [uploading, setUploading] = useState();
  const [uploadedImg, setUploadedImg] = useState(null);

  const error = useSelector((state) => state.userData.error);
  if (error) console.log(error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getUserData(userId));
    }
    if (status === "success") {
      setChangedData({
        username: data.username,
        email: data.email,
      });
    }
  }, [dispatch, status]);

  const handleChange = (value) => {
    setChangedData({ ...changedData, ...value });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(
      storage,
      "profileImages/" + file + file.name + nanoid()
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

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
            setUploading("Wait we'r : getting your image ready");
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
          setUploadedImg(downloadURL);
          handleChange({ profilePic: downloadURL });
          console.log("File available at", downloadURL);
          setUploading("Your image is ready click update");
        });
      }
    );
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <Container className="mt-3">
          <Form
            onSubmit={() => {
              dispatch(updateUserProfile({ userId, changedData }));
            }}
          >
            <Row>
              {status === "failed" ? (
                <p className="alert alert-danger">
                  Something went wrong while geting your data
                </p>
              ) : (
                <>
                  <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12 col-12">
                    <Card className="h-100">
                      <Card.Body>
                        <div className="account-settings">
                          <div className="user-profile">
                            <div className="user-avatar position-relative">
                              <img
                                className="position-absolute top-0 start-0 bottom-0"
                                src={uploadedImg || data.profilePic}
                                alt="User avatar"
                              />
                              <input
                                className="form-control img-upload position-absolute top-0 start-0 bottom-0"
                                type="file"
                                name="profilePIC"
                                id="profilePIC"
                                onChange={(e) => {
                                  handleUpload(e);
                                }}
                              />
                              <div className="choose-icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-50 w-50"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                  />
                                </svg>
                              </div>
                            </div>
                            {uploading ? (
                              <p className="alert alert-dark">{uploading}</p>
                            ) : (
                              ""
                            )}
                            <h5 className="user-name mx-auto">
                              {data.username}
                            </h5>
                            <h6 className="user-email text-center">
                              {data.email}
                            </h6>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-xl-9 col-lg-8 col-md-12 col-sm-12 col-12">
                    <Card className="h-100">
                      <Card.Body>
                        <div className="row gutters">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <h6 className="mb-3 lead">Acount Details</h6>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                              <label htmlFor="username">User Name</label>
                              <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter your user name"
                                value={changedData.username || ""}
                                onChange={(e) =>
                                  handleChange({ username: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                              <label htmlFor="eMail">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="eMail"
                                disabled
                                readOnly
                                placeholder="Enter email ID"
                                value={changedData.email || ""}
                                onChange={(e) =>
                                  handleChange({ email: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-group">
                              <label htmlFor="password">Password</label>
                              <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter password"
                                onChange={(e) => {
                                  if (e.target.value !== "") {
                                    handleChange({ password: e.target.value });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row gutters">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-2">
                            <div className="text-right">
                              <button
                                type="button"
                                id="cancel"
                                name="cancel"
                                className="btn btn-secondary me-2"
                                onClick={() => navigate("/")}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                id="submit"
                                name="submit"
                                className={`btn updateBtn`}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </>
              )}
            </Row>
          </Form>
        </Container>
        <div style={{ backgroundColor: "black" }}>
          <Footer className="profile-footer" />
        </div>
      </div>
    </>
  );
};

export default Profile;
