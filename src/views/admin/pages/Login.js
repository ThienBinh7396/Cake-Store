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

import "./../../../styles/login.css";

import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import cookie from './../../../utils/cookie';
import Axios from "axios";
import { BASE_URL } from './../../../constant/index';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.axios = Axios.create({
      baseURL: BASE_URL,
    
    });
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

    const updateCookie = (key, value) => {
      cookie.setCookie(key, value);
    }

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
          password: this.state.password.value,
         
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
          
            updateCookie('_admin', data.admin);
            updateCookie('_atk', data.token);

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
                  onKeyDown={e => e.keyCode === 13 && btnLoginClickHandle(e)}
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
                  onKeyDown={e => e.keyCode === 13 && btnLoginClickHandle(e)}
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


export default withSnackbar(withRouter(Login));
