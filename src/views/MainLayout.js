import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import AdminLogin from "./admin/pages/Login";
import AdminContentView from "./admin/layouts/ContentView";
import ClientContentView from "./client/layouts/ContentViews";
import cookie from "../utils/cookie";

class MainLayout extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <Client />
          </Route>
        </Switch>
      </Router>
    );
  }
}

const adminMiddleware = {
  isAuthenticated: () => {
    console.log(!!cookie.getCookie("_atk") && !!cookie.getCookie("_admin"));
    return !!cookie.getCookie("_atk") && !!cookie.getCookie("_admin");
  }
};

const AdminProtectedRouter = ({ component: Component, ...rest }) => {
  let type = rest.type || "page";

  return (
    <Route
      {...rest}
      render={props =>
        type === "login" ? (
          adminMiddleware.isAuthenticated() === false ? (
            <Component {...props} />
          ) : (
            <Redirect to="/admin/dashboard" />
          )
        ) : adminMiddleware.isAuthenticated() === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin/login" />
        )
      }
    />
  );
};
function Client() {
  let { path } = useRouteMatch();
  console.log(path);
  return (
    <Switch>
      <Route path={`${path}`}>
        <ClientContentView />
      </Route>
    </Switch>
  );
}

function Admin() {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <AdminProtectedRouter path={`${path}/login`} type="login" component={AdminLogin} />
      <AdminProtectedRouter path={`${path}`} component={AdminContentView}/>
    </Switch>
  );
}

export default MainLayout;
