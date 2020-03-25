import React, { useEffect, Suspense, lazy } from "react";
import ClientProvider from "../context/ClientProvider";
import CommonComponent from "../component/CommonComponent";
import LoadingComponentRelative from '../../../common/component/LoadingComponentRelative';
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "../../../styles/scss/index.scss";
import "../../../styles/client.css";


function RouterView(props) {
  useEffect(() => {}, [props.location]);

  return (
    <ClientProvider>
      <CommonComponent>
        <SwitchPage location={props.location} />
      </CommonComponent>
    </ClientProvider>
  );
}

const Blog = lazy(() => import("../pages/Blog"));
const BlogDetails = lazy(() => import("../pages/BlogDetails"));
const Home = lazy(() => import("../pages/Home"));
const Store = lazy(() => import("../pages/Store"));
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const Contact = lazy(() => import("../pages/Contact"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));


function SwitchPage({ location }) {
  return (
    <Suspense
      fallback={<LoadingComponentRelative style={{minHeight: '320px'}}>Loading...</LoadingComponentRelative>}
    >
      <Switch key={location.key}>
        <Route exact path="/blog" component={Blog} />
        <Route exact path="/blog/:title/:id" component={BlogDetails} />

        <Route exact path="/contact" component={Contact} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/product/:id" component={ProductDetails} />
        
        <Route exact path="/cart" component={Cart}/>
        <Route exact path="/checkout" component={Checkout} />
        
        <Route exact path="/home" component={Home} />
        <Route exact path="/">
          <Redirect to="/home"></Redirect>
        </Route>
      </Switch>
    </Suspense>
  );
}
export default withRouter(RouterView);
