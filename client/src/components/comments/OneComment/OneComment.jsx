import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./onecomment.scss";

import { FaTrash, FaEdit } from "react-icons/fa";

const OneComment = ({ comment, deleteComment, commentIndx, editComment }) => {
  const [user, setUser] = useState();
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
  useEffect(() => {
    getUserData();
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
          <div className="action-btns">
            {comment.userId === id && (
              <>
                <FaEdit
                  className="edit-btn"
                  onClick={() => editComment(commentIndx)}
                />

                <FaTrash
                  className="delete-btn"
                  onClick={() => deleteComment(commentIndx)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OneComment;
