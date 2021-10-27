import React, { useContext, useState } from "react";
import axios from "axios";
import SingleComment from "./SingleComment";
import { ImStarFull, ImStarEmpty } from "react-icons/im";
import { RiSendPlaneLine, RiSendPlaneFill } from "react-icons/ri";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import URLContext from "./URLContext";

export default function Food({ name, score, comment_count }) {
  const [vote, setVote] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommented, setIsCommented] = useState(false);
  const [commentsOfFood, setCommentsOfFood] = useState([]);

  const baseURL = useContext(URLContext);

  String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = { i: "İ", ı: "I", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç" };
    string = string.replace(/(([iışğüçö]))/g, function (letter) {
      return letters[letter];
    });
    return string.toUpperCase();
  };

  return (
    <div style={foodContainerStyle}>
      <div style={headerAndScoreContainer}>
        <p style={headerStyle}>{name}</p>

        <div style={scoreContainerStyle}>
          <p style={scoreStyle}>{score}</p>
          <ImStarFull style={{ marginBottom: "4px" }} />
        </div>
      </div>
      {!isVoted ? (
        <div style={rateContainer}>
          <div onClick={() => setVote(1)}>
            {vote < 1 ? <Star isEmpty={true} /> : <Star isEmpty={false} />}
          </div>

          <div onClick={() => setVote(2)}>
            {vote < 2 ? <Star isEmpty={true} /> : <Star isEmpty={false} />}
          </div>

          <div onClick={() => setVote(3)}>
            {vote < 3 ? <Star isEmpty={true} /> : <Star isEmpty={false} />}
          </div>

          <div onClick={() => setVote(4)}>
            {vote < 4 ? <Star isEmpty={true} /> : <Star isEmpty={false} />}
          </div>

          <div onClick={() => setVote(5)}>
            {vote < 5 ? <Star isEmpty={true} /> : <Star isEmpty={false} />}
          </div>
        </div>
      ) : null}
      {!isVoted ? (
        vote === 0 ? (
          <div style={oylaContainerStyleDisabled}>
            <p style={{ fontFamily: "Ubuntu" }}>Oyla</p>
          </div>
        ) : (
          <div
            onClick={() => {
              var url = baseURL + "/vote";
              setIsVoted(true);
              const headers = {
                Authorization: "Bearer Tago",
              };
              axios
                .post(
                  url,
                  { foodName: name.turkishToUpper(), score: vote },
                  {
                    headers,
                  }
                )
                .then((response) => {
                  console.log(response.data);
                });
            }}
            style={oylaContainerStyle}
          >
            <p style={{ fontFamily: "Ubuntu" }}>Oyla</p>
          </div>
        )
      ) : (
        <p style={{ fontFamily: "Ephesis", fontSize: "24px" }}>Teşekkürler!</p>
      )}

      {!commentsExpanded ? (
        <div
          onClick={() => {
            var url = baseURL + "/get-food-comments";

            setCommentsExpanded(true);
            const headers = {
              Authorization: "Bearer Tago",
            };
            axios
              .post(
                url,
                { foodName: name.turkishToUpper() },
                {
                  headers,
                }
              )
              .then((response) => {
                setCommentsOfFood(response.data);
                console.log(response.data);
                console.log(commentsOfFood);
              });
          }}
          style={seeCommentsContainer}
        >
          <p style={{ fontFamily: "Ubuntu", fontSize: "14px" }}>
            Günün yorumlarını gör ({comment_count})
          </p>
        </div>
      ) : (
        <div
          onClick={() => setCommentsExpanded(false)}
          style={seeCommentsContainer}
        >
          <p style={{ fontFamily: "Ubuntu", fontSize: "14px" }}>
            Yorumları gizle
          </p>
        </div>
      )}

      {!commentsExpanded ? null : (
        <div style={commentsContainerStyle}>
          {!isCommented ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <textarea
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorum yap..."
                style={{
                  borderWidth: "0px",
                  backgroundColor: "#8c4646",
                  color: "white",
                  marginTop: "10px",
                  height: "60px",
                  width: "90%",
                  fontFamily: "Ubuntu",
                  fontSize: "14px",
                  padding: "5px",
                }}
              />

              {comment === "" ? (
                <RiSendPlaneLine
                  size="26"
                  style={{ margin: "10px", marginTop: "15px" }}
                />
              ) : (
                <RiSendPlaneFill
                  onClick={() => {
                    var url = baseURL + "/comment";

                    setIsCommented(true);
                    const headers = {
                      Authorization: "Bearer Tago",
                    };
                    axios
                      .post(
                        url,
                        { text: comment, foodName: name.turkishToUpper() },
                        {
                          headers,
                        }
                      )
                      .then((response) => {
                        console.log(response.data);
                      });
                  }}
                  size="26"
                  style={{ margin: "10px", marginTop: "15px" }}
                />
              )}
            </div>
          ) : (
            <p style={{ fontFamily: "Ephesis", fontSize: "24px" }}>
              Yorum yapıldı!
            </p>
          )}
          {commentsOfFood.map((comment) => (
            <SingleComment key={comment.commentId} comment={comment} />
          ))}

          <Link
            style={{ textDecorationColor: "white" }}
            to={{ pathname: "/foods/" + name, state: score }}
          >
            <p
              style={{
                fontFamily: "Ubuntu",
                fontSize: "14px",
                color: "white",
              }}
            >
              {" "}
              Yemeğin tüm yorumlarını gör
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

const Star = ({ isEmpty }) => {
  return (
    <div>{isEmpty ? <ImStarEmpty size={32} /> : <ImStarFull size={32} />}</div>
  );
};

// STYLES
const foodContainerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  // height: "300px",
  width: "90%",
  backgroundColor: "#843d3d",
  color: "white",
  marginTop: "10px",
  marginBottom: "10px",
  padding: "10px",
  borderRadius: "12px",
};

const headerStyle = {
  paddingLeft: "2px",
  fontFamily: "Ephesis",
  fontSize: "22px",
};

const scoreStyle = {
  fontFamily: "Ephesis",
  fontSize: "20px",
  paddingRight: "4px",
};

const headerAndScoreContainer = {
  display: "flex",
  height: "20%",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  // backgroundColor: "black",
  borderBottom: "1px inset white",
};

const scoreContainerStyle = {
  height: "100%",
  // backgroundColor: "red",
  width: "20%",
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
};

const rateContainer = {
  height: "20%",
  // backgroundColor: "red",
  width: "80%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "25px",
  marginBottom: "15px",
  //marginBottom: "8%",
};

const seeCommentsContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "25%",
  // backgroundColor: "yellow",
  width: "100%",
};

const oylaContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "20%",
  width: "90%",
  backgroundColor: "#402727",
  borderRadius: "8px",
  marginTop: "10px",
  marginBottom: "10px",
};

const oylaContainerStyleDisabled = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "20%",
  width: "90%",
  backgroundColor: "#5c3232",
  borderRadius: "8px",
  marginTop: "10px",
  marginBottom: "10px",
};

const commentsContainerStyle = {
  borderTop: "1px outset white",
  flexDirection: "column",
  width: "100%",
  display: "flex",
  justifycontent: "center",
  alignItems: "center",
};

const commentButtonStyle = {
  marginTop: "10px",
  width: "50%",
  height: "20%",
  backgroundColor: "#402727",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
};

const commentButtonStyleDisabled = {
  marginTop: "10px",
  width: "50%",
  height: "20%",
  backgroundColor: "#5c3232",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
};

const singleCommentContainer = {
  backgroundColor: "#753838",
  display: "flex",
  width: "100%",
  borderRadius: "4px",
  marginTop: "15px",
  alignItems: "center",
};
