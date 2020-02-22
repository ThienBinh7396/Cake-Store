import React, { Component, createRef } from "react";
import { Box } from "@material-ui/core";
import { ClientContext } from "./../context/ClientProvider";

import { widthToBreackpoint } from "./../../../utils/helper";

const mapBreakPoint = ["xs", "sm", "md", "lg", "xl"];

class BaseCarousel extends Component {
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    this.now = btoa(new Date());
    this.carouselRef = createRef();

    this.timer = null;
  }

  state = {
    windowWidth: 0,
    itemToShow: 1,
    itemToSlide: 1,
    autoplay: this.props.autoplay || true,
    playSpeed: this.props.playSpeed || 5000,
    transition: 0,
    defaultTransition: this.props.transition || 300,
    breakPoint: "xl", // default: xl
    breakPoints: null, // Example: {md:{itemToShow: 2, itemToSlide: 2}, sm:{itemToShow: 1}}
    default: {
      // default for xl size ( > 1920px)
      itemToShow: 1,
      itemToSlide: 1,
      playSpeed: this.props.playSpeed || 5000
    },
    currentIndex: this.props.children.length,
    defaultCarousels: this.props.children.length,
    carousels: this.props.children.length * 3
  };

  componentDidMount() {
    console.log(this.state);

    this.itemWidth = this.carouselRef.current.parentElement.offsetWidth;

    this.setState(
      {
        autoplay: this.props.autoplay !== undefined ? this.props.autoplay : true,
        defaultCarousels: this.props.children.length,
        carousels: this.props.children.length * 3,
        itemToShow: this.props.itemToShow || 1,
        itemToSlide: this.props.itemToSlide || 1,
        defaultTransition: this.props.transition || 300,
        default: {
          // default for xl size ( > 1920px)
          itemToShow: this.props.itemToShow || 1,
          itemToSlide: this.props.itemToSlide || 1,
          playSpeed: this.props.playSpeed || 5000
        }
      },
      () => {
        this.updateCarousels();
        this.autoPlay(this.state.autoplay);
      }
    );
  }

  componentDidUpdate() {
    const { width } = this.context;

    if (width.data && width.data !== this.state.windowWidth) {
      let _breakPoint = widthToBreackpoint(width.data);
      if (_breakPoint !== this.state.breakPoint) {
        this.setState(
          {
            breakPoint: _breakPoint
          },
          () => {
            this.updateBreakPoint();
          }
        );
      }

      this.setState(
        {
          windowWidth: width.data
        },
        () => {
          this.itemWidth = this.carouselRef.current.parentElement.offsetWidth;
        }
      );
    }
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateBreakPoint() {
    if (!this.state.breakPoints) return;

    let _findBreakPoint = this.state.breakPoints[this.state.breakPoint];

    if (_findBreakPoint) {
      this.setState({
        itemToShow: _findBreakPoint.itemToShow || this.state.default.itemToShow,
        itemToSlide:
          _findBreakPoint.itemToSlide || this.state.default.itemToShow
      });
    } else {
      let _findAvalidBreakPoint = mapBreakPoint
        .slice(0)
        .reduce((prev, current, index, arr) => {
          if (current === this.state.breakPoint || prev === 1) {
            if (this.state.breakPoints[current]) {
              arr.splice(1);
              return current;
            }
            return 1;
          }
          return 0;
        }, 0);

      this.setState({
        itemToShow:
          _findAvalidBreakPoint === 1 ||
          !this.state.breakPoints[_findAvalidBreakPoint].itemToShow
            ? this.state.default.itemToShow
            : this.state.breakPoints[_findAvalidBreakPoint].itemToShow,
        itemToSlide:
          _findAvalidBreakPoint === 1 ||
          !this.state.breakPoints[_findAvalidBreakPoint].itemToSlide
            ? this.state.default.itemToSlide
            : this.state.breakPoints[_findAvalidBreakPoint].itemToSlide
      });
    }
  }

  autoPlay(bool) {
    console.log(bool);
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (bool) {
      this.timer = setInterval(() => {
        this.stepTo(this.state.currentIndex + this.state.itemToSlide);
      }, this.state.playSpeed);
    }
  }

  resetIndex() {
    let _index =
      this.state.currentIndex < this.state.defaultCarousels
        ? this.state.currentIndex + this.state.defaultCarousels
        : this.state.currentIndex >= this.state.defaultCarousels * 2
        ? this.state.currentIndex - this.state.defaultCarousels
        : this.state.currentIndex;


    this.setState({
      currentIndex: _index
    });
  }

  stepTo(index, resetItemToSlide) {
    this.setState(
      {
        transition: this.state.defaultTransition,
        currentIndex: index,
        itemToSlide: resetItemToSlide ? 1 : this.state.itemToSlide
      },
      () => {
        setTimeout(() => {
          this.setState(
            { transition: 0, itemToSlide: this.state.default.itemToSlide },
            () => {
              this.resetIndex();
            }
          );
        }, this.state.defaultTransition);
      }
    );
  }

  getWrapperWidth() {
    return this.state.carousels > 1
      ? this.itemWidth * this.state.carousels + "px"
      : this.itemWidth + "px";
  }

  updateCarousels() {
    this.setState({
      carousels: this.state.defaultCarousels * 3
    });
  }

  renderChildren() {
    return [
      ...this.props.children.map((it, index) => {
        return (
          <div
            key={`#${this.now}-${index}-prev`}
            style={{
              width: this.itemWidth / this.state.itemToShow + "px"
            }}
            className="base-carousel-item"
          >
            {it}
          </div>
        );
      }),
      ...this.props.children.map((it, index) => {
        return (
          <div
            key={`#${this.now}-${index}-active`}
            style={{
              width: this.itemWidth / this.state.itemToShow + "px"
            }}
            className="base-carousel-item"
          >
            {it}
          </div>
        );
      }),
      ...this.props.children.map((it, index) => {
        return (
          <div
            key={`#${this.now}-${index}-next`}
            style={{
              width: this.itemWidth / this.state.itemToShow + "px"
            }}
            className="base-carousel-item"
          >
            {it}
          </div>
        );
      })
    ];
  }

  render() {
    return (
      <div
        className="base-carousel-wrapper"
        ref={this.carouselRef}
        onMouseDown={e => {
          this.autoPlay(false);
        }}
        onMouseUp={e => {
          this.autoPlay(this.state.autoplay);
        }}
      >
        <Box maxWidth="lg" className="relative">
          <div
            className="base-carousel-control control-prev"
            onClick={() => {
              this.stepTo(this.state.currentIndex - 1, true);
            }}
          >
            <i className="fas fa-angle-left"></i>
          </div>
          <div
            className="base-carousel-control control-next"
            onClick={() => {
              this.stepTo(this.state.currentIndex + 1, true);
            }}
          >
            <i className="fas fa-angle-right"></i>
          </div>
          <div
            className="base-carousel"
            style={{
              width: this.getWrapperWidth(),
              paddingBottom: "168px",
              transitionDuration: `${this.state.transition}ms`,
              transform: `translateX(-${(this.itemWidth /
                this.state.itemToShow) *
                this.state.currentIndex}px)`
            }}
          >
            {this.renderChildren()}
          </div>
        </Box>
      </div>
    );
  }
}
export default BaseCarousel;
