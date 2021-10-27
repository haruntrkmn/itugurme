import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import App from "./App";
import logo from "./images/logo.png";

export default function Signin() {
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
        <Header clickable={false} />
      </div>
      <div style={menuTextContainerStyle}>
        <p style={menuTextStyle}> Giriş Yap</p>
      </div>
      <div style={formContainer}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p style={{ fontFamily: "Ubuntu", marginBottom: "10px" }}>
              Kullanıcı Adı
            </p>
            <input
              style={{
                height: "40px",
                width: "200px",
                borderRadius: "10px",
                border: "none",
              }}
              type="text"
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <p style={{ fontFamily: "Ubuntu", marginBottom: "10px" }}>Şifre</p>
            <input
              style={{
                height: "40px",
                width: "200px",
                borderRadius: "10px",
                border: "none",
              }}
              type="password"
            />
          </label>
          <div style={{ marginTop: "50px" }}>
            <button
              style={{
                backgroundColor: "#843d3d",
                width: "200px",
                height: "40px",
                borderRadius: "15px",
                border: "none",
                color: "#e3e1e1",
                fontSize: "16px",
                fontFamily: "Ubuntu",
              }}
              type="submit"
            >
              Gurmele
            </button>
          </div>
          <Link to="/signup">
            <p
              style={{
                color: "black",
                textDecorationColor: "black",
                fontFamily: "Ubuntu",
                marginTop: "30px",
              }}
            >
              Hesabın yok mu?
            </p>
          </Link>
        </form>
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

const formContainer = {
  marginTop: "20px",

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
  borderBottom: "1px outset rgba(0, 0, 0, 1)",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
