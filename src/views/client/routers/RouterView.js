import React from "react";
import ClientProvider from "../context/ClientProvider";
import CommonComponent from "../component/CommonComponent";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "../../../css/client.css";

import Home from "../pages/Home";
import Store from "../pages/Store";
import Blog from "../pages/Blog";

function RouterView(props) {
  console.log(props);
  return (
    <ClientProvider>
      <CommonComponent>
        <SwitchPage location={props.location} />
      </CommonComponent>
    </ClientProvider>
  );
}

function SwitchPage({ location }) {
  return (
 
      <Switch key={location.key}>
        <Route exact path="/blog">
          <Blog />
        </Route>
        <Route exact path="/store">
          <Store />
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
export default withRouter(RouterView);
