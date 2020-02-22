import React from "react";
import ClientProvider from "../context/ClientProvider";
import CommonComponent from "../component/CommonComponent";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../pages/Home";

import "../../../css/client.css";

import Blog from "../pages/Blog";

function RouterView(props) {
  return (
    <ClientProvider>
      <CommonComponent>
        <SwitchPage />
      </CommonComponent>
    </ClientProvider>
  );
}

function SwitchPage(props) {
  return (
    <Switch>
      <Route exact path="/blog">
        <Blog />
      </Route>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/">
        <Redirect to="/home"></Redirect>
      </Route>
    </Switch>
  );
}
export default RouterView;
