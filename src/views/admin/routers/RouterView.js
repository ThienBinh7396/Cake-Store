import React, { Suspense, lazy } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  withRouter
} from "react-router-dom";

import AdminProvider from "../context/AdminProvider";
import CommonComponent from "../component/CommonComponent";

import LoadingComponentRelative from "../../../common/component/LoadingComponentRelative";

function ContentView(props) {
  return (
    <AdminProvider>
      <CommonComponent>
        <SwitchPages location={props.location} />
      </CommonComponent>
    </AdminProvider>
  );
}

const Home = lazy(() => import("../pages/Home"));
const Employee = lazy(() => import("../pages/Employee"));
const Cake = lazy(() => import("../pages/Cake"));
const Cakes = lazy(() => import("../pages/Cakes"));
const Categories = lazy(() => import("../pages/Categories"));
const Tags = lazy(() => import("../pages/Tags"));
const Blog = lazy(() => import("../pages/Blog"));
const Blogs = lazy(() => import("../pages/Blogs"));

function SwitchPages({ location }) {
  const { url } = useRouteMatch();

  return (
    <Suspense
      fallback={<LoadingComponentRelative style={{minHeight: '320px'}}>Loading...</LoadingComponentRelative>}
    >
      <Switch key={location.key}>
        <Route path={`${url}/contact`} component={Home} />
        <Route exact path={`${url}/employee`} component={Employee} />

        <Route exact path={`${url}/cake/edit/:id`} component={Cake} />
        <Route exact path={`${url}/cake`} component={Cakes} />
        <Route exact path={`${url}/cake/add`} component={Cake} />

        <Route exact path={`${url}/category`} component={Categories} />

        <Route exact path={`${url}/tag`} component={Tags} />

        <Route exact path={`${url}/blog/edit/:id`} component={Blog} />
        <Route exact path={`${url}/blog/add`} component={Blog} />
        <Route exact path={`${url}/blog`} component={Blogs} />
        <Route exact path={`${url}/dashboard`} component={Home} />

        <Route exact path={`${url}`}>
          <Redirect to={`${url}/dashboard`}>
            <Home />
          </Redirect>
        </Route>
      </Switch>
    </Suspense>
  );
}

export default withRouter(ContentView);
