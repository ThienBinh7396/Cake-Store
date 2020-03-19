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
      containerTarget: null,
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
    console.log(this.props.containertarget);

    this.setState(
      {
        src: this.props.src,
        placeHolder: this.props.placeHolder || "/img/placeholder.png",
        effect: this.props.effect || "opacity",
        alt: this.props.alt || "Image alt",
        keepRatio: this.props.keepRatio || false,
        width: this.props.width || "100%",
        height: this.props.height || "auto",
        containerTarget:
          this.props.containertarget !== undefined
            ? document.querySelector(this.props.containertarget)
            : document.getElementById("main-content")
      },
      () => {

        this.initHandleScroll();
      }
    );
  }

  componentDidUpdate() {
    if (this.state.src !== this.props.src) {
      this.setState(
        {
          src: this.props.src,
          loaded: false
        },
        () => {
          this.initHandleScroll();
        }
      );
    }
  }

  componentWillUnmount() {
    this.state.containerTarget.removeEventListener("scroll", this.handleScroll);
  }

  initHandleScroll() {
    this.handleScroll();

    this.state.containerTarget.addEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    console.log(this.props.containertarget, this.state.containerTarget.scrollTop);

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

      this.state.containerTarget.removeEventListener(
        "scroll",
        this.handleScroll
      );
    }
  }

  render() {
    return (
      <img
        src={this.state.placeHolder}
        width={this.state.width}
        height={this.state.height}
        ref={imgElm => (this.imgElm = imgElm)}
        className="lazy-image transition-medium"
        alt={this.state.alt}
      />
    );
  }
}
