import React from "react";
import "./lazy-image.css";
import { ClientContext } from "./../../views/client/context/ClientProvider";

function elementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

export default class LazyImage extends React.Component {
  static contextType = ClientContext;

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      src: null,
      placeHolder: null,
      effect: null,
      alt: null,
      keepRatio: false,
      width: null,
      height: null
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.setState(
      {
        src: this.props.src,
        placeHolder: this.props.placeHolder,
        effect: this.props.effect || "opacity",
        alt: this.props.alt || "Image alt",
        keepRatio: this.props.keepRatio || false,
        width: this.props.width || "100%",
        height: this.props.height || "100%"
      },
      () => {
        this.handleScroll();
      }
    );

    document
      .getElementById("main-content")
      .addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    document
      .getElementById("main-content")
      .removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if (!this.state.loaded && elementInViewport(this.imgElm)) {
      // Load real image
      const imgLoader = new Image();
      imgLoader.src = this.state.src;
      imgLoader.onload = () => {
        const ratioWH = imgLoader.width / imgLoader.height;

        if (this.imgElm) {
          this.imgElm.setAttribute(`src`, `${this.props.src}`);

          this.state.keepRatio &&
            this.imgElm.setAttribute(`height`, `${this.state.width / ratioWH}`);

          this.imgElm.classList.add(`${this.state.effect}`);

          this.setState({
            loaded: true
          });
        }
      };

      document
      .getElementById("main-content")
      .removeEventListener("scroll", this.handleScroll);
    }
  }

  render() {
    return (
      <img
        src={this.state.placeHolder}
        width={this.state.width}
        height={this.state.height}
        ref={imgElm => (this.imgElm = imgElm)}
        className="lazy-image"
        alt={this.state.alt}
      />
    );
  }
}
