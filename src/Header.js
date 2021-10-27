import React from "react";
import { Link } from "react-router-dom";
import App from "./App";
import logo from "./images/logo.png";

export default function Header({ clickable = true }) {
  return (
    <div style={header}>
      {clickable ? (
        <Link to="/">
          <img style={logoStyle} src={logo} alt="Logo" />
        </Link>
      ) : (
        <img style={logoStyle} src={logo} alt="Logo" />
      )}
    </div>
  );
}

// STYLES
const header = {
  padding: "4px",
  width: "100%",
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#843d3d",
  color: "white",
};

const logoStyle = {
  width: "60px",
};
