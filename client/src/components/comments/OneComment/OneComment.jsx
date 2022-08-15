import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./onecomment.scss";

import { FaTrash, FaEdit } from "react-icons/fa";

const OneComment = ({ comment, deleteComment, commentIndx, editComment }) => {
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState();
  const token = JSON.parse(localStorage.getItem("token"));
  const id = JSON.parse(localStorage.getItem("id"));

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/users/find/" + comment.userId,
        {
          headers: {
            token: "Bearers " + token,
          },
        }
      );
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAdmin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/users/find/" + id,
        {
          headers: {
            token: "Bearers " + token,
          },
        }
      );
      setAdmin(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserData();
    getAdmin();
  }, []);
  return (
    <>
      <div className="comment-row">
        <div className="comment-img">
          <img src={user?.profilePic} alt="" />
        </div>
        <div className="comment-btns">
          <div className="comment-info">
            <span className="username">{user?.username}</span>
            <p className="comment-text">{comment.commentText}</p>
          </div>
          <div
            className="action-btns"
            style={
              admin?.isAdmin && !user?.isAdmin
                ? { justifyContent: "flex-end" }
                : undefined
            }
          >
            {comment.userId === id && (
              <>
                <FaEdit
                  className="edit-btn"
                  onClick={() => editComment(commentIndx)}
                />
              </>
            )}
            {comment.userId === id || admin?.isAdmin ? (
              <FaTrash
                className="delete-btn"
                onClick={() => deleteComment(commentIndx)}
              />
            ) : undefined}
          </div>
        </div>
      </div>
    </>
  );
};

export default OneComment;
