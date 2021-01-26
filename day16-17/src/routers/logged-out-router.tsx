import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFound } from "../pages/404";
import { Login } from "../pages/login";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
