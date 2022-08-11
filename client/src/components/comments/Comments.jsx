import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./comments.scss";
import OneComment from "./OneComment/OneComment";

const Comments = ({ movieId }) => {
  const [mvComments, setMvComments] = useState([]);
  const commentInput = useRef();
  const userId = JSON.parse(localStorage.getItem("id"));
  const token = JSON.parse(localStorage.getItem("token"));

  //   delete comment
  const deleteComment = (cmntId) => {
    mvComments.splice(cmntId, 1);
    (async (comment) => {
      try {
        await axios.put(
          "http://localhost:8800/api/movies/" + movieId,
          { comments: [...comment] },
          {
            headers: {
              token: "test " + token,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    })(mvComments);
    // updateMovie(comment);
    getMovie();
  };

  //   get movie comments

  const getMovie = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/movies/find/" + movieId,
        {
          headers: {
            token: "test " + token,
          },
        }
      );
      console.log(response.data.comments);
      setMvComments(response.data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  //   update movie with comment

  const updateMovie = async (comment) => {
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
      console.log([...mvComments, comment]);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = () => {
    const commentText = commentInput.current.value;
    const comment = {
      commentText,
      userId,
    };
    updateMovie(comment);
    getMovie();
  };

  useEffect(() => {
    getMovie();
  }, [movieId]);

  return (
    <div className="comments-cont">
      <div className="add-sec">
        <input type="text" placeholder="Add comment" ref={commentInput} />
        <button className="add-btn" onClick={addComment}>
          Add
        </button>
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
