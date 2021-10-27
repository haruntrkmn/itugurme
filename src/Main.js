import React, { useEffect, useState, useContext } from "react";
import Food from "./Food";
import Header from "./Header";
import axios from "axios";

import URLContext from "./URLContext";

export default function Main() {
  const [foods, setFoods] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [gotLunchInfo, setGotLunchInfo] = useState(false);
  const [isLunch, setIsLunch] = useState(true);

  const baseURL = useContext(URLContext);

  String.prototype.turkishToLower = function () {
    var string = this;
    var letters = { İ: "i", I: "ı", Ş: "ş", Ğ: "ğ", Ü: "ü", Ö: "ö", Ç: "ç" };
    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) {
      return letters[letter];
    });
    return string.toLowerCase();
  };

  String.prototype.turkishToUpper = function () {
    var string = this;
    var letters = { i: "İ", ı: "I", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç" };
    string = string.replace(/(([iışğüçö]))/g, function (letter) {
      return letters[letter];
    });
    return string.toUpperCase();
  };

  useEffect(() => {
    var url = baseURL + "/main_page";
    const headers = {
      Authorization: "Bearer Tago",
    };
    axios.get(url, { headers }).then((response) => {
      console.log(response.data);
      setIsLunch(response.data.isLunch);
      setGotLunchInfo(true);
      setFoods(response.data.foods);
      setUserComments(response.data.userComments);
      setUserVotes(response.data.userVotes);
    });
  }, []);

  const convertToCamelCase = (str) => {
    const arr = str.turkishToLower().split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).turkishToUpper() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");
    return str2;
  };
  return (
    <div style={mainContainer}>
      <div style={headerContainer}>
        <Header />
      </div>
      {gotLunchInfo ? (
        isLunch ? (
          <div style={menuTextContainerStyle}>
            <p style={menuTextStyle}> Öğle Menüsü</p>
          </div>
        ) : (
          <div style={menuTextContainerStyle}>
            <p style={menuTextStyle}> Akşam Menüsü</p>
          </div>
        )
      ) : (
        <div style={menuTextContainerStyle}></div>
      )}
      <div style={container}>
        {foods.map((food) => (
          <Food
            key={food.name}
            name={convertToCamelCase(food.name)}
            score={food.score}
            comment_count={food.commentCount}
            todays_comments={[
              {
                commenter: "harun123",
                gurme_score: 10,
                text: "süper yemekti",
                score: 5,
                id: 1,
              },
              {
                commenter: "user61",
                gurme_score: 8,
                text: "beğenmedim",
                score: 0,
                id: 2,
              },
              {
                commenter: "user6212",
                gurme_score: 8,
                text: "güzel bir yemekti. zevk aldım.",
                score: 0,
                id: 3,
              },
              {
                commenter: "user61",
                gurme_score: 8,
                text: "soğuktu. yağ içinde yüzüyordu. hoşuma gitmedi.",
                score: 0,
                id: 4,
              },
            ]}
          />
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

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  //  top: 0; left: 0; width: 100%
};

const mainContainer = {
  // backgroundColor: "white",
  width: "100%",
};

const menuTextStyle = {
  fontFamily: "Ephesis",
  fontSize: "30px",
  marginTop: "80px",
  marginBottom: "10px",
};

const menuTextContainerStyle = {
  // backgroundColor: "red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
