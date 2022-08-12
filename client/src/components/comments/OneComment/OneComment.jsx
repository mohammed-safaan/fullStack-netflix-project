import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./onecomment.scss";

import {FaTrash} from "react-icons/fa";

const OneComment = ({ comment, deleteComment, commentIndx }) => {
  const [user, setUser] = useState();
  const token = JSON.parse(localStorage.getItem("token"));

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
      //   console.log(response.data);
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
        <div className="comment-text">{comment.commentText}</div>
          <button onClick={() => deleteComment(commentIndx)}><FaTrash/></button>
        </div>
      </div>
    </>
  );
};

export default OneComment;
