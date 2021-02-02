import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "../components/Header";
import { LogoutPage } from "../pages/logout";
import { PageNotFound } from "../pages/404";
import { PodcastsPage } from "../pages/main/podcasts";
import { PodcastPage } from "../pages/main/podcast";

export const LoggedInRouter = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/logout" exact>
          <LogoutPage />
        </Route>
        <Route path="/podcast/:id" exact>
          <PodcastPage />
        </Route>
        <Route path="/" exact>
          <PodcastsPage />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
};
