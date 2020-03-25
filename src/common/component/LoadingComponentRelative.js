import React, { Component } from "react";
import { Container } from "@material-ui/core";

class LoadingComponentRelative extends Component {
  render() {
    return (
      <Container
        maxWidth="lg"
        className="d-flex p-24 m-24"
        style={{ justifyContent: "center", alignItems: "center", ...this.props.style }}
     >
        <div className="loader-inner line-scale">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Container>
    );
  }
}

export default LoadingComponentRelative;
