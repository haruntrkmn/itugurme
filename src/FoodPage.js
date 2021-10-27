import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import SingleComment from "./SingleComment";
import SingleCommentForFood from "./SingleCommentForFood";
import { useParams, useLocation } from "react-router-dom";
import { ImStarFull } from "react-icons/im";

export default function FoodPage(props) {
  var { foodName } = useParams();
  var location = useLocation();
  var score = location.state;

  console.log("location: ", location);
  const [comments, setComments] = useState([]);

  String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = { i: "İ", ı: "I", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç" };
    string = string.replace(/(([iışğüçö]))/g, function (letter) {
      return letters[letter];
    });
    return string.toUpperCase();
  };

  useEffect(() => {
    let isMounted = true;
    const headers = {
      Authorization: "Bearer Tago",
    };
    axios
      .post(
        "http://2729-81-215-233-213.ngrok.io/get-food-info",
        { foodName: foodName.turkishToUpper() },
        {
          headers,
        }
      )
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={headerContainer}>
        <Header />
      </div>
      <div style={menuTextContainerStyle}>
        <p style={menuTextStyle}> {foodName}</p>
      </div>
      <div
        style={{
          display: "flex",
          // backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "14%",
          height: "60px",
        }}
      >
        <div
          style={{ fontFamily: "Ubuntu", fontWeight: "bold", fontSize: "20px" }}
        >
          {score}
        </div>
        <ImStarFull size="16px" />
      </div>

      <div
        style={{
          borderTop: "1px inset black",
          display: "flex",
          //backgroundColor: "red",
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <p style={{ fontFamily: "Ubuntu" }}>Tüm Yorumlar</p>
        {comments.map((comment) => (
          <SingleCommentForFood key={comment.commentId} comment={comment} />
        ))}
      </div>
    </div>
  );
}

// STYLES
const headerContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  position: "fixed",
  width: "100%",
  top: "0",
  left: "0",
  borderBottom: "1px inset white",
  //  top: 0; left: 0; width: 100%
};

const menuTextContainerStyle = {
  // backgroundColor: "red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const menuTextStyle = {
  fontFamily: "Ephesis",
  fontSize: "30px",
  marginTop: "80px",
  marginBottom: "10px",
};
