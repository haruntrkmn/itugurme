import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { URLProvider } from "./URLContext";

ReactDOM.render(
  <React.StrictMode>
    <URLProvider>
      <App />
    </URLProvider>
  </React.StrictMode>,

  document.getElementById("root")
);
