import React, { useState } from "react";
import FoodPage from "./FoodPage";
import SignupPage from "./SignupPage";
import SigninPage from "./SigninPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./Main";

function App() {
  const [token, setToken] = useState();

  /*
  if (!token) {
    return (
      <Router>
        <SigninPage setToken={setToken} />
      </Router>
    );
  }
  */

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/foods/:foodName">
          <FoodPage />
        </Route>
        <Route path="/signup">
          <SignupPage />
        </Route>
        <Route path="/signin">
          <SigninPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

// STYLES
