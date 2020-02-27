import React from "react";

import "../../../css/admin.css";

import { AdminContext } from "../context/AdminProvider";
import LoadingDialog from "../../../common/component/LoadingDialog";
import { withStyles, Breadcrumbs } from "@material-ui/core";
import { NavLink, withRouter, Link } from "react-router-dom";

import {
  AppBar,
  CardMedia,
  IconButton,
  Divider,
  Box,
  Avatar,
  ButtonBase,
  MenuItem,
  Menu
} from "@material-ui/core";
import BaseIcon from "../../../common/component/BaseIcon";
import PerfectScrollbar from "@opuscapita/react-perfect-scrollbar";
import LoadingComponent from "../../../common/component/LoadingComponent";
import BaseDialog from "../../../common/component/BaseDialog";
import cookie from "../../../utils/cookie";

const drawerWidth = 72;
const drawerOpenWidth = 280;

const useStyles = theme => ({
  root: {
    display: "flex",
    paddingTop: "56px",
    fontFamily: "'Roboto', sans-serif"
  },
  appbar: {
    width: "100%",
    height: "56px",
    lineHeight: "56px",
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#FAFBFC",
    transition: "all .2s",
    boxShadow:
      "0 0.46875rem 2.1875rem rgba(4,9,20,0.03), 0 0.9375rem 1.40625rem rgba(4,9,20,0.03), 0 0.25rem 0.53125rem rgba(4,9,20,0.05), 0 0.125rem 0.1875rem rgba(4,9,20,0.03)"
  },
  appbarLogo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: `${drawerWidth}px`,
    paddingLeft: "4px",
    transition: "0.2s",
    "&.open": {
      width: `${drawerOpenWidth}px`
    },
    "& img.logo": {
      width: "36px",
      height: "36px",
      marginLeft: "8px",
      transition: "0.2s"
    },
    "&.open img.logo": {
      marginLeft: 0
    },
    "& .logo-title": {
      width: "0px",
      marginLeft: "0",
      visibility: "hidden"
    },
    "&.open .logo-title": {
      width: "auto",
      marginLeft: "4px",
      visibility: "visible"
    }
  },
  appbarContent: {
    width: 0,
    flexGrow: 1,
    padding: "0 6px 0 6px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& .btn-drawer-toggle": {
      width: "40px",
      height: "40px",
      color: "#3f6ad8"
    },
    "& .btn-drawer-toggle i": {
      color: "#3f6ad8",
      fontSize: "20px"
    },
    "& .appbarRight": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: "#343a40",

      "& .btn": {
        fontSize: "14px",
        padding: "12px 6px",
        "& .email": {
          opacity: "0.8"
        },
        "& .dropdownIcon": {
          fontSize: "24px",
          fontWeight: "bold",
          marginLeft: "-2px"
        }
      }
    }
  },
  headerMenu: {
    "& .MuiMenu-list": {
      padding: "0",
      borderTop: "4px solid #3f6ad8",
      "& .MuiMenuItem-root": {
        width: "152px",
        fontSize: "15px",
        padding: "8px 12px 8px 12px",
        alignItems: "center",
        "& i": {
          marginRight: "8px"
        },
        "& .MuiBox-root": {
          marginTop: "2px"
        }
      }
    }
  },
  drawer: {
    position: "relative",
    width: `${drawerWidth}px`,
    height: "calc(100vh - 56px)",
    background: "#FDFDFD",
    transition: "0.2s",
    "&.open": {
      width: `${drawerOpenWidth}px`
    }
  },
  nav: {
    position: "relative",
    padding: "0 15px",
    transition: "0.2s",
    "&.open": {
      padding: "0 18px"
    },
    "& .navBarHeading": {
      textTransform: "uppercase",
      fontSize: ".9rem",
      margin: ".75rem 0",
      fontWeight: "bold",
      color: "#3f6ad8"
    },
    "&.open .navItem .navTitle": {
      visibility: "visible",
      display: "inline-block"
    },
    "&.open .navItem": {
      paddingLeft: "45px"
    },
    "& .navItem": {
      display: "flex",
      width: "100%",
      lineHeight: "2.4rem",
      height: "2.4rem",
      position: "relative",
      borderRadius: ".25rem",
      color: "#343a40",
      margin: ".1rem 0 .8rem",
      paddingLeft: "42px",
      fontSize: ".9rem",
      cursor: "pointer",
      textDecoration: "none",

      "&.active": {
        backgroundColor: "#E0F3FF",
        color: "#3f6ad8",
        fontWeight: "bold"
      },
      "& i": {
        width: "34px",
        height: "34px",
        lineHeight: "34px",
        textAlign: "center",
        position: "absolute",
        opacity: "0.4",
        color: "#000000d4",
        left: "4px",
        top: "50%",
        marginTop: "-17px",
        fontSize: "1.5rem"
      },
      "&.active i": {
        color: "#2a4384"
      },
      "&:hover i": {
        opacity: "0.7"
      },
      "& .navTitle": {
        position: "relative",
        visibility: "hidden",
        display: "none"
      }
    }
  },
  mainContent: {
    position: "relative",
    width: 0,
    height: "calc(100vh - 56px)",
    padding: "0 8px",
    flexGrow: 1,
    background: "#ECEFF1"
  }
});

const nav = [
  {
    path: "/admin/dashboard",
    title: "Dashboard",
    route: "dashboard",
    icon: "pe-7s-rocket"
  },
  {
    path: "/admin/employee",
    title: "Employee",
    route: "employee",
    icon: "pe-7s-users"
  },
  {
    path: "/admin/cake",
    title: "Cakes",
    route: "cake",
    icon: "pe-7s-plugin"
  },
  {
    path: "/admin/tag",
    title: "Tags",
    route: "tag",
    icon: "pe-7s-ticket"
  },
  {
    path: "/admin/blog",
    title: "Blogs",
    route: "blog",
    icon: "pe-7s-diamond"
  }
];


class CommonComponent extends React.Component {
  static contextType = AdminContext;

  constructor(props) {
    super(props);

    console.log(this.props);
  }

  state = {
    open: true,
    setOpen: _open => {
      this.setState({ open: _open });
    },
    anchorEl: null,
    setAnchorEl: value => {
      this.setState({ anchorEl: value });
    },
    breadcrumbs: []
  };

  handleDrawer = val => {
    this.state.setOpen(!this.state.open);
  };

  handleResizeWindow = () => {
    let w = window.innerWidth;
    this.state.setOpen(w > 960);
  };

  handleClick = event => {
    this.state.setAnchorEl(event.currentTarget);
  };

  handleClose = func => {
    this.state.setAnchorEl(null);
    if (typeof func == "function") {
      func();
    }
  };

  logout = () => {
    cookie.setCookie('_atk', null);
    cookie.setCookie('_admin', null);
    this.props.history.push("/admin/login");
  };

  componentDidMount() {
    const { adminActions } = this.props;
    this.adminActions = adminActions;
    const {admin} = this.context;

    console.log(admin);

    if(admin.data === null){
      admin.fetchData();
    }



    this.updateBreadcrumbs();
    this.handleResizeWindow();
    window.addEventListener("resize", () => this.handleResizeWindow());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.handleResizeWindow());
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateBreadcrumbs();
    }
  }

  updateBreadcrumbs() {
    console.log("%c Render", "color:red;font-size:32px");
    let _path = this.props.location.pathname.split("/");

    let _breadcrumbs = [];

    for (let i = _path.length - 1; i >= 0; --i) {
      let find = nav.find(it => it.route === _path[i]);

      if (find) {
        _breadcrumbs.push({
          type: i === _path.length - 1 ? "text" : "link",
          text: find.title,
          to: find.path
        });
        break;
      } else {
        _breadcrumbs.push({
          type: "text",
          text: _path[i]
        });
      }
    }
    _breadcrumbs.push({ type: "link", text: "Home", to: "/admin" });

    this.setState({
      breadcrumbs: _breadcrumbs.reverse()
    });
  }

  render() {
    const { progressDialog, loadingComponent, dialogReloadPage } = this.context;
    const { classes } = this.props;

    const admin = this.context.admin.data;

    return (
      <div className={classes.root}>
        <LoadingComponent
          open={loadingComponent.show}
          dense={!this.state.open}
        ></LoadingComponent>
        <LoadingDialog
          open={progressDialog.open}
          title={progressDialog.message}
        />
        <BaseDialog
          zIndex={2000}
          open={dialogReloadPage.open}
          maxWidth="xs"
          fullWidth={true}
          title="Something went wrong"
          type="text"
          onClose={() => {
            window.location.reload();
            dialogReloadPage.update(false);
          }}
        >
          Please try refreshing the page or closing and re-opening your browser
          window.
        </BaseDialog>
        <AppBar position="fixed" className={classes.appbar}>
          <div
            className={`${classes.appbarLogo} ${this.state.open ? "open" : ""}`}
          >
            <CardMedia
              className="logo"
              component="img"
              height="100%"
              image="/img/logo-icon.png"
            />
            <CardMedia
              className="logo-title"
              component="img"
              image="/img/logo-title.png"
            />
          </div>
          <div className={classes.appbarContent}>
            <IconButton
              className="btn-drawer-toggle"
              onClick={this.handleDrawer}
            >
              <BaseIcon
                icon={`fas ${this.state.open ? "fa-bars" : "fa-times"}`}
              ></BaseIcon>
            </IconButton>
            <Box className="appbarRight">
              <Avatar src="/img/avatar.png" />
              <ButtonBase
                className="btn"
                aria-controls="account-menu"
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <Box className="email" mr={0.5}>
                  {admin ? admin.email : ""}
                </Box>
                <BaseIcon icon="pe-7s-angle-down" className="dropdownIcon" />
              </ButtonBase>

              <Menu
                open={Boolean(this.state.anchorEl)}
                keepMounted
                id="account-menu"
                onClose={this.handleClose}
                anchorEl={this.state.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center"
                }}
                className={classes.headerMenu}
              >
                <MenuItem onClick={this.handleClose}>
                  <BaseIcon size="17" icon="pe-7s-user" />
                  <Box>My account</Box>
                </MenuItem>
                <MenuItem onClick={() => this.handleClose(this.logout)}>
                  <BaseIcon size="16" icon="pe-7s-next-2" />
                  <Box>Logout</Box>
                </MenuItem>
              </Menu>
            </Box>
          </div>
        </AppBar>

        <div className={`${classes.drawer} ${this.state.open ? "open" : ""}`}>
          <PerfectScrollbar>
            <div className={`${classes.nav} ${this.state.open ? "open" : ""}`}>
              <div className={"navBarHeading"}>
                {this.state.open ? (
                  "Menu"
                ) : (
                  <Divider
                    style={{ backgroundColor: "#e0f3ff", height: 1.5 }}
                  />
                )}
              </div>
              {nav.map(it => {
                return (
                  <NavLink
                    className={`${"navItem"} btn-effect`}
                    key={it.title}
                    to={it.path}
                  >
                    <div
                      className="effect-wrapper underline-from-left"
                      style={{ backgroundColor: "#8aa2de" }}
                    ></div>
                    <BaseIcon
                      className={"navIcon"}
                      size="20"
                      icon={it.icon}
                    ></BaseIcon>
                    <div className={"navTitle"}>{it.title}</div>
                  </NavLink>
                );
              })}
            </div>
          </PerfectScrollbar>
        </div>
        <PerfectScrollbar className={classes.mainContent}>
          {this.state.breadcrumbs.length !== 0 && (
            <Breadcrumbs style={{ margin: "14px 0px 2px 8px" }}>
              {this.state.breadcrumbs.map(it =>
                it.type === "link" ? (
                  <Link key={it.text} className="link" to={it.to}>
                    {it.text}
                  </Link>
                ) : (
                  <span
                    key={it.text}
                    color="textPrimary"
                    style={{ textTransform: "capitalize" }}
                  >
                    {it.text}
                  </span>
                )
              )}
            </Breadcrumbs>
          )}

          {this.props.children}
        </PerfectScrollbar>
      </div>
    );
  }
}



export default withStyles(useStyles)(withRouter(CommonComponent));
