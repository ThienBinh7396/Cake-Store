import React from "react";
import { Skeleton } from "@material-ui/lab";

export default class ComponentWrapperHelper extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleScrollMainContent = this.handleScrollMainContent.bind(this);
  }
  state = {
    first: false
  };

  elementInViewport(el) {
    if (!el) return false;

    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  handleScrollMainContent() {
    if (!this.state.first && this.elementInViewport(this.componentRef)) {
      document
        .getElementById("main-content")
        .removeEventListener("scroll", this.handleScrollMainContent);

      this.setState({
        first: true
      });
    }
  }

  componentDidMount() {
    document
      .getElementById("main-content")
      .addEventListener("scroll", this.handleScrollMainContent);
  }

  componentWillUnmount() {
    document
      .getElementById("main-content")
      .removeEventListener("scroll", this.handleScrollMainContent);
  }

  render() {
    return (
      <div ref={el => (this.componentRef = el)} className={this.props.className}>
        {!this.state.first && (
          <div
            className="py-8 px-2"
          >
            <Skeleton
            variant="rect"
            width="100%"
            height="260px"
            animation="wave"
          />
          </div>
        )}
        {this.state.first &&  this.props.children}
      </div>
    );
  }
}
