import React, { Component } from "react";

import PropTypes from "prop-types";

export default class WrapperLoadingComponent extends Component {
  render() {
    return (
      <div className="wrapper-loading-component z-index-default">
        <div className={["overlay", this.props.loading && 'show'].join(" ")}>
          <div className="loader-inner line-scale">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

WrapperLoadingComponent.propTypes = {
  loading: PropTypes.bool.isRequired
};
