import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./comments.scss";
import OneComment from "./OneComment/OneComment";

const Comments = ({ movieId }) => {
  const [mvComments, setMvComments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndx, setEditIndx] = useState();
  const commentInput = useRef();
  const userId = JSON.parse(localStorage.getItem("id"));
  const token = JSON.parse(localStorage.getItem("token"));

  // edit comment
  const editComment = (cmntId) => {
    setEditMode(true);
    setEditIndx(cmntId);
    commentInput.current.value = mvComments[cmntId].commentText;
  };

  // save edited comment to DB
  const updateEditComment = () => {
    setEditMode(false);
    const editedCmntText = commentInput.current.value;
    commentInput.current.value = "";
    let updateCmnt = [...mvComments];
    updateCmnt.map((ele, indx) => {
      if (indx === editIndx) {
        ele.commentText = editedCmntText;
      }
    });
    setMvComments(updateCmnt);
    (async (comment) => {
      try {
        await axios.put(
          "http://localhost:8800/api/movies/" + movieId,
          { comments: comment },
          {
            headers: {
              token: "test " + token,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    })(updateCmnt);
    console.log(updateCmnt);
  };

  //   delete comment
  const deleteComment = (cmntId) => {
    let newComment = mvComments.filter((ele, indx) => indx !== cmntId);
    setMvComments(newComment);
    console.log(newComment);
    (async (comment) => {
      try {
        await axios.put(
          "http://localhost:8800/api/movies/" + movieId,
          { comments: comment },
          {
            headers: {
              token: "test " + token,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    })(newComment);
  };

  //   get movie comments

  const getComments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/movies/find/" + movieId,
        {
          headers: {
            token: "test " + token,
          },
        }
      );
      setMvComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  //   update movie with comment

  const updateMovieComment = async (comment) => {
    try {
      await axios.put(
        "http://localhost:8800/api/movies/" + movieId,
        { comments: [...mvComments, comment] },
        {
          headers: {
            token: "test " + token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = () => {
    const commentText = commentInput.current.value;
    if (commentText) {
      const comment = {
        commentText,
        userId,
      };
      setMvComments((prev) => [...prev, comment]);
      updateMovieComment(comment);

      commentInput.current.value = "";
    }
  };

  useEffect(() => {
    getComments();
  }, [movieId]);

  return (
    <div className="comments-cont">
      <div className="add-sec">
        <input type="text" placeholder="Add comment" ref={commentInput} />
        {!editMode ? (
          <button className="add-btn" onClick={addComment}>
            Add
          </button>
        ) : (
          <button className="add-btn" onClick={updateEditComment}>
            Edit
          </button>
        )}
      </div>
      <div className="display-sec">
        {mvComments.length !== 0 ? (
          mvComments.map((ele, indx) => {
            return (
              <OneComment
                key={indx}
                comment={ele}
                commentIndx={indx}
                deleteComment={deleteComment}
                editComment={editComment}
              />
            );
          })
        ) : (
          <h3>No comments</h3>
        )}
      </div>
    </div>
  );
};

export default Comments;
