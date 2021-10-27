import React, { useState } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";

export default function SingleComment({ comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [score, setScore] = useState(comment.score);
  var initialScore = comment.score;

  return (
    <div key={comment.id} style={singleCommentContainer}>
      <div style={{ display: "flex", flexDirection: "column", flex: "5" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
            flexDirection: "row",
            height: "40px",
            borderBottom: "1px inset rgba(255, 255, 255, 0.5)",
          }}
        >
          <p
            style={{
              fontFamily: "Ubuntu",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
              fontWeight: "bold",
            }}
          >
            {comment.commenter}
          </p>
          <p
            style={{
              fontFamily: "Ubuntu",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            gurme puanı: {comment.gurmeScore}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // borderBottom: "1px inset white",
          }}
        >
          {" "}
          <p
            style={{
              fontFamily: "Ubuntu",
              fontSize: "14px",
              color: "white",
              marginLeft: "10px",
            }}
          >
            {comment.text}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          //backgroundColor: "black",
          flex: "1",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "5px",
          paddingBottom: "5px",
          height: "95px",
        }}
      >
        {isLiked ? (
          <AiFillLike
            onClick={() => {
              setScore(initialScore);
              setIsLiked(false);
            }}
            size="48"
          />
        ) : (
          <AiOutlineLike
            onClick={() => {
              setScore(initialScore + 1);
              setIsLiked(true);
              setIsDisliked(false);
            }}
            size="48"
          />
        )}

        <p style={{ fontFamily: "Ubuntu", fontSize: "14px" }}> {score} </p>
        {isDisliked ? (
          <AiFillDislike
            onClick={() => {
              setScore(initialScore);
              setIsDisliked(false);
            }}
            size="48"
          />
        ) : (
          <AiOutlineDislike
            onClick={() => {
              setScore(initialScore - 1);
              setIsLiked(false);
              setIsDisliked(true);
            }}
            size="48"
          />
        )}
      </div>
    </div>
  );
}

// STYLES
const singleCommentContainer = {
  // backgroundColor: "#753838",
  display: "flex",
  width: "100%",
  borderRadius: "4px",
  marginTop: "15px",
  alignItems: "center",
};
