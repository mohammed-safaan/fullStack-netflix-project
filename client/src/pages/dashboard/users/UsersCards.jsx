import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllUsers,
  deleteUser,
} from "../../../features/dashboard/usersSlice";
import { Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UsersCards() {
  const navigate = useNavigate();
  const userDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  const UsersData = useSelector((state) => state.allUsers.value);
  const status = useSelector((state) => state.allUsers.status);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  return (
    <>
      {status === "success" && UsersData &&
        UsersData.map((ele, index) => (
          <Col key={index} sm={12} md={12} lg={6} className="">
            <Card className=" position-relative">
              <div className="card-body d-flex p-3 user-info">
                <img
                  src={ele.profilePic}
                  alt=""
                  className="user-img rounded-circle thumpnail"
                />
                <div className="ps-3 text-truncate">
                  <p className="card-title h4">{ele.username}</p>
                  <p className="card-subtitle text-truncate">{ele.email}</p>
                  <p className="join-date w-100 pt-2 m-0 blockquote-footer">
                    Joined : {userDate(ele.createdAt)}
                  </p>
                </div>
              </div>
              <div className="card-icon card-footer d-flex justify-content-between align-items-center">
                <button type="button" onClick={() => navigate("" + ele._id)}>
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
                    dispatch(deleteUser(ele._id));
                    dispatch(getAllUsers());
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
            </Card>
          </Col>
        ))}
    </>
  );
}
