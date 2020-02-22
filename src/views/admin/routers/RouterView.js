import React from "react";
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
import Home from "../pages/Home";

import Employee from "../pages/Employee";
import Cake from "../pages/Cake";
import AdminProvider from "../context/AdminProvider";
import CommonComponent from "../component/CommonComponent";
import Cakes from "../pages/Cakes";
import Blog from "../pages/Blog";
import Tags from './../pages/Tags';
import Blogs from "../pages/Blogs";



function ContentView(props) {
  return (
    <AdminProvider>
      <CommonComponent>
        <SwitchPages />
      </CommonComponent>
    </AdminProvider>
  );
}

function SwitchPages() {
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${url}/contact`}>
        <Home />
      </Route>
      <Route exact path={`${url}/employee`}>
        <Employee />
      </Route>
      <Route exact path={`${url}/cake/edit/:id`}>
        <Cake />
      </Route>
      <Route exact path={`${url}/cake/add`}>
        <Cake />
      </Route>
      <Route exact path={`${url}/cake`}>
        <Cakes />
      </Route>
      <Route exact path={`${url}/tag`}>
        <Tags />
      </Route>
      <Route exact path={`${url}/blog/edit/:id`}>
        <Blog />
      </Route>
      <Route exact path={`${url}/blog/add`}>
        <Blog />
      </Route>
      <Route exact path={`${url}/blog`}>
        <Blogs />
      </Route>
      <Route exact path={`${url}/dashboard`}>
        <Home />
      </Route>

      <Route exact path={`${url}`}>
        <Redirect to={`${url}/dashboard`}>
          <Home />
        </Redirect>
      </Route>
    </Switch>
  );
}

export default ContentView;
