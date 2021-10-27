import React, { useState } from "react";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";

export default function SingleComment({ comment }) {
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
            borderBottom: "1px inset rgba(0, 0, 0, 0.5)",
          }}
        >
          <p
            style={{
              fontFamily: "Ubuntu",
              fontSize: "14px",
              //color: "rgba(255, 255, 255, 0.5)",
              color: "rgba(0, 0, 0, 0.8)",
              fontWeight: "bold",
            }}
          >
            {comment.commenter}
          </p>
          <p
            style={{
              fontFamily: "Ubuntu",
              fontSize: "14px",
              //color: "rgba(255, 255, 255, 0.5)",
              color: "rgba(0, 0, 0, 0.8)",
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
              //color: "white",
              color: "rgba(0, 0, 0, 0.8)",
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
        <p
          style={{
            fontFamily: "Ubuntu",
            fontSize: "14px",
            //color: "white",
            color: "rgba(0, 0, 0, 0.8)",
          }}
        >
          {" "}
          {score}{" "}
        </p>
      </div>
    </div>
  );
}

// STYLES
const singleCommentContainer = {
  backgroundColor: "rgba(0, 0, 0, 0.01)",
  display: "flex",
  width: "100%",
  marginTop: "15px",
  alignItems: "center",
  borderRadius: "20px",
  borderBottomLeftRadius: "40px",
  borderBottom: "3px inset rgba(0, 0, 0, 0.5)",
};
