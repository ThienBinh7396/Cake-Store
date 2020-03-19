import React, { Component } from "react";
import {
  Collapse,
  IconButton,
  Card,
  CardActions,
  Typography
} from "@material-ui/core";

import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

class SnackbarLayout extends Component {
  state = {
    key: null,
    message: null,
    expand: true,
    type: 'default',
    icon: false,
    types: {
      default: {
        color: '#e47277',
        icon: null,
        dark: false
      },
      success: {
        color: '#43a047',
        icon: <i className="far fa-check-circle"></i>,
        dark: false
      },
      info: {
        color: '#2979ff',
        icon: <i className="fas fa-exclamation-circle"></i>,
        dark: false
      },
      warning: {
        color: '#ffa000',
        icon: <i className="fas fa-exclamation-triangle"></i>,
        dark: true
      },
      error: {
        color: '#d32f2f',
        icon: <i className="far fa-times-circle"></i>,
        dark: false
      }
    }
  };

  componentDidMount() {
    const { id, message, type, icon } = this.props;

    let _update = {
      key: id,
      message,
      type: type || 'default',
      icon: icon || false
    };

    this.setState({
      ..._update
    });
  }

  _handleDismiss = () => {
    this.props.closeSnackbar(this.state.key);
  };

  _handleExpandClick = () => {
    this.setState({
      expand: !this.state.expand
    });
  };

  render() {
    return (
      <Card className="snackbar-wrapper">
        <CardActions className={`header ${this.state.types[this.state.type].dark && 'dark'}`} style={{backgroundColor: this.state.types[this.state.type].color}}>
          <Typography variant="subtitle1" className="title">
            {this.state.icon && this.state.types[this.state.type].icon}
            {this.state.message}
          </Typography>
          <div className="icons">
            <IconButton
              className={`expanded ${!this.state.expand && 'hide' }`}
              aria-label="Show more"
              onClick={this._handleExpandClick}
            >
              <i className="fas fa-angle-down" />
            </IconButton>
            <IconButton onClick={this._handleDismiss}>
              <i className="fas fa-times" />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={this.state.expand} timeout="auto" unmountOnExit>
          <div className="snackbar-content p-8">{this.props.children}</div>
        </Collapse>
      </Card>
    );
  }
}

SnackbarLayout.propTypes = {
  id: PropTypes.any.isRequired,
  message: PropTypes.string.isRequired
};

export default withSnackbar(SnackbarLayout);
