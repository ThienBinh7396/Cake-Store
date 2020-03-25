import React from "react";

import PropTypes from "prop-types";

export default class LoadingPlaceholder extends React.PureComponent {
  render() {
    return (
      <div
        className="loader-wrapper d-flex"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: this.props.width,
          height: this.props.height,
          background: this.props.background,
          ...this.props.style
        }}
      >
        <div className="loader-inner ball-spin-fade-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

LoadingPlaceholder.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  background: PropTypes.string
};

LoadingPlaceholder.defaultProps = {
  width: "100%",
  height: "100%",
  background: "transparent"
};
