import React from "react";

import {
  Container,
  CardMedia,
  TextField,
  ButtonBase,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from "@material-ui/core";

import "./../../../css/login.css";
import { connect } from "react-redux";
import * as axiosAction from "../../../actions/axios";
import * as adminAction from "../../../actions/admin";
import { bindActionCreators } from "redux";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props);

    const { admin, adminActions } = this.props;


    this.axios = admin.axios;
    this.adminActions = adminActions;
  }

  state = {
    open: false,
    message: "",
    doLogin: false,
    email: {
      value: "",
      helpText: "Email is invalid!",
      errorText: () => {
        return this.state.email.validate() ? "" : this.state.email.helpText;
      },
      validate: () => {
        let val = this.state.email.value;
        return val.length === 0 || /.+@.+\..+/.test(val);
      },
      check: () => {
        let val = this.state.email.value;
        return !!val && /.+@.+\..+/.test(val);
      }
    },
    password: {
      value: "",
      helpText:
        "Passwords must be at least 6 characters. It must include numbers and letters!",
      errorText: () => {
        return this.state.password.validate()
          ? ""
          : this.state.password.helpText;
      },
      validate: () => {
        let val = this.state.password.value;
        return (
          val.length === 0 ||
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(val)
        );
      },
      check: () => {
        let val = this.state.password.value;
        return !!val && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(val);
      }
    }
  };

  render() {
    const handleChange = prop => event => {
      let newVal = { ...this.state[prop], value: event.target.value };
      this.setState({ ...this.state, [prop]: newVal });
    };

    const { enqueueSnackbar } = this.props;
    const showToast = (message, variant = "default") => {
      enqueueSnackbar(message, { variant });
    };

    const btnLoginClickHandle = event => {
      this.setState({
        doLogin: true
      });

      if (!this.state.email.check() || !this.state.password.check()) {
        handleOpen("Email or password is invalid!");
        this.setState({
          doLogin: false
        });
        return;
      }

      this.axios
        .post("admin/employees/login", {
          email: this.state.email.value,
          password: this.state.password.value
        })
        .then(rs => {
          this.setState({
            doLogin: false
          });

          let { data, type, message } = rs.data;

          if (type !== "success") {
            showToast(message, type);
          } else {
            showToast('Redirecting to admin page...', type);
          
            this.adminActions.updateAdmin(data.admin);
            this.adminActions.updateAdminToken(data.token);

            this.props.history.push('/admin/login');
          }

        })
        .catch(err => {
          this.setState({
            doLogin: false
          });
          showToast("Login failed!", "error");
        });
    };

    const handleClose = () => {
      this.setState({
        open: false
      });
    };

    const handleOpen = (message = "") => {
      this.setState({
        open: true,
        message
      });
    };

    return (
      <Container maxWidth="md">
        <Dialog open={this.state.open} maxWidth="xs">
          <DialogTitle style={{ color: "#ff1010" }}>Action failed!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <Box color="error.main">Close</Box>
            </Button>
          </DialogActions>
        </Dialog>
        <div className="form-wrapper">
          <div className="left-content" >
            <CardMedia  component="img" height="100%" image="/img/bg-01.jpg" />
          </div>
          <Box className="right-content" px={4}>
            <form className="fullWidth">
              <div className="title">
                Account <span>Login</span>
              </div>
              <div className="form-base">
                <TextField
                  label="Email"
                  variant="outlined"
                  color="secondary"
                  className="fullWidth"
                  value={this.state.email.value}
                  onChange={handleChange("email").bind(this)}
                  error={!this.state.email.validate()}
                  helperText={this.state.email.errorText()}
                />
              </div>
              <div className="form-base">
                <TextField
                  label="Password"
                  variant="outlined"
                  color="secondary"
                  className="fullWidth"
                  value={this.state.password.value}
                  onChange={handleChange("password")}
                  error={!this.state.password.validate()}
                  helperText={this.state.password.errorText()}
                />
              </div>
              <ButtonBase className="fullWidth" onClick={btnLoginClickHandle}>
                <Box className="login-btn" color="default.main">{
                  this.state.doLogin ?
                    <CircularProgress size={24} color="inherit"/>
                  : 'Login'
                }
                </Box>
              </ButtonBase>
            </form>
          </Box>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    admin: state.admin
  };
};

const mapDispatchToProps = dispatch => {
  return {
    axiosActions: bindActionCreators(axiosAction, dispatch),
    adminActions: bindActionCreators(adminAction, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(withRouter(Login)));
