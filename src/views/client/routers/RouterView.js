import React, { useEffect } from "react";
import ClientProvider from "../context/ClientProvider";
import CommonComponent from "../component/CommonComponent";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "../../../styles/client/index.scss";
import "../../../styles/client.css";

import Home from "../pages/Home";
import Store from "../pages/Store";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import ProductDetails from "../pages/ProductDetails";
import BlogDetails from "./../pages/BlogDetails";
import Cart from "./../pages/Cart";

function RouterView(props) {
  useEffect(() => {
    console.log("props.location change...............");
    setTimeout(() => {
      document.getElementById("main-content").scrollTop = 0;
    }, 100);
  }, [props.location]);

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
      <Route exact path="/contact">
        <Contact xxx={1} />
      </Route>
      <Route exact path="/blog/:title/:id">
        <BlogDetails />
      </Route>
      <Route exact path="/store">
        <Store />
      </Route>
      <Route exact path="/cart">
        <Cart />
      </Route>
      <Route exact path="/product/:id">
        <ProductDetails />
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
