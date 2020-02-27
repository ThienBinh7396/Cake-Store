import React, { Component, createRef } from "react";
import { Box } from "@material-ui/core";
import { ClientContext } from "../../views/client/context/ClientProvider";

import { widthToBreackpoint } from "../../utils/helper";

const mapBreakPoint = ["xs", "sm", "md", "lg", "xl"];

class BaseCarousel extends Component {
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    this.carouselRef = createRef();
  }

  state = {
    noControl: false,
    stopOnHover: false,
    isSliding: false,
    pagination: false,
    windowWidth: window.innerWidth,
    itemToShow: 1,
    itemToSlide: 1,
    autoplay: this.props.autoplay || true,
    playSpeed: this.props.playSpeed || 5000,
    transition: 0,
    defaultTransition: this.props.transition || 560,
    breakPoint: "xl", // default: xl
    breakPoints: null, // Example: {md:{itemToShow: 2, itemToSlide: 2}, sm:{itemToShow: 1}}
    default: {
      // default for xl size ( > 1920px)
      itemToShow: 1,
      itemToSlide: 1,
      playSpeed: this.props.playSpeed || 5000
    },
    currentIndex: this.props.children ? this.props.children.length : 3,
    defaultCarousels: this.props.children ? this.props.children : [],
    carousels: this.props.children ? this.props.children.length * 3 : 3,
    childrenDom: null
  };

  componentDidMount() {
    this.itemWidth = this.carouselRef.current.parentElement.offsetWidth;

    this.now = btoa(`${Date.now() + Math.random()}`);

    this._ismounted = true;

    this.timer = null;

    this.setState(
      {
        stopOnHover: this.props.stoponhover || true,
        pagination: this.props.pagination || false,
        noControl: this.props.nocontrol || false,
        playSpeed: this.props.playspeed || 6000,
        autoplay:
          this.props.autoplay !== undefined ? this.props.autoplay : true,
        defaultCarousels: this.props.children ? this.props.children : [],
        currentIndex: this.props.children ? this.props.children.length : 1,
        carousels: this.props.children ? this.props.children.length * 3 : 3,
        itemToShow: this.props.itemToShow || 1,
        itemToSlide: this.props.itemToSlide || 1,
        breakPoints: this.props.breakPoints || null,
        defaultTransition: this.props.transition || 650,
        default: {
          // default for xl size ( > 1920px)
          itemToShow: this.props.itemToShow || 1,
          itemToSlide: this.props.itemToSlide || 1,
          playSpeed: this.props.playSpeed || 5000
        }
      },
      () => {
        this.updateBreakPoint();
        this.updateChildren();
      }
    );
  }

  comparePropsChildren(child1, child2) {
    let _child1 = child1.map(it => it.key);
    let _child2 = child2.map(it => it.key);

    return (
      _child1.length === _child2.length &&
      _child1.sort().every(function(value, index) {
        return value === _child2.sort()[index];
      })
    );
  }

  componentDidUpdate(prevProps, prevStates) {
    if (
      this.props.children &&
      prevProps.children &&
      !this.comparePropsChildren(prevProps.children, this.props.children)
    ) {
      this.updateBreakPoint();
    }

    const { width } = this.context;

    if (width.data && width.data !== this.state.windowWidth) {
      this.setState(
        {
          windowWidth: width.data
        },
        () => {
          this.itemWidth = this.carouselRef.current.parentElement.offsetWidth;
          this.updateBreakPoint();
        }
      );
    }
  }
  componentWillUnmount() {
    this._ismounted = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateBreakPoint() {
    let _breakPoint = widthToBreackpoint(this.state.windowWidth);
    this.setState(
      {
        breakPoint: _breakPoint
      },
      () => {
        if (!this.state.breakPoints) {
          this.updateChildren();
          return;
        }

        let _findBreakPoint = this.state.breakPoints[this.state.breakPoint];

        if (_findBreakPoint) {
          this.setState(
            {
              itemToShow:
                _findBreakPoint.itemToShow || this.state.default.itemToShow,
              itemToSlide:
                _findBreakPoint.itemToSlide || this.state.default.itemToShow
            },
            () => {
              this.updateChildren();
            }
          );
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

          this.setState(
            {
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
            },
            () => {
              this.updateChildren();
            }
          );
        }
      }
    );
  }

  autoPlay(bool) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (bool && this.state.autoplay) {
      this.timer = setInterval(() => {
        if (!this._ismounted) return;

        this.stepTo(this.state.currentIndex + this.state.itemToSlide);
      }, this.state.playSpeed);
    }
  }

  resetIndex() {
    let _index =
      this.state.currentIndex < this.state.defaultCarousels.length
        ? this.state.currentIndex + this.state.defaultCarousels.length
        : this.state.currentIndex >= this.state.defaultCarousels.length * 2
        ? this.state.currentIndex - this.state.defaultCarousels.length
        : this.state.currentIndex;

    console.log("resetIndex: " + _index);
    this.setState({
      currentIndex: _index
    });
  }
  
  stepTo(index, resetItemToSlide) {
    if(!this._ismounted) return;
    this.setState(
      {
        isSliding: true,
        transition: this.state.defaultTransition,
        currentIndex: index,
        itemToSlide: resetItemToSlide ? 1 : this.state.itemToSlide
      },
      () => {
        setTimeout(() => {
          if(!this._ismounted) return;

          this.setState(
            {
              isSliding: false,
              transition: 0,
              itemToSlide: this.state.default.itemToSlide
            },
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
      ? this.itemWidth *
          Math.ceil(this.state.carousels / this.state.itemToShow) +
          "px"
      : this.itemWidth + "px";
  }

  updateChildren() {
    this.setState(
      {
        defaultCarousels: this.props.children ? this.props.children : 1,
        carousels: this.props.children ? this.props.children.length * 3 : 3,
        childrenDom: this.props.children
          ? [
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
            ]
          : []
      },
      () => {
        this.autoPlay(this.state.autoplay);
      }
    );
  }

  render() {
    return (
      <div
        className={`base-carousel-wrapper ${this.props.className}`}
        ref={this.carouselRef}
        onMouseEnter={e => {
          if (this.state.stopOnHover && this.state.autoplay) {
            this.autoPlay(false);
          }
        }}
        onMouseLeave={e => {
          if (this.state.stopOnHover && this.state.autoplay) {
            this.autoPlay(true);
          }
        }}
        onMouseDown={e => {
          this.autoPlay(false);
        }}
        onMouseUp={e => {
          this.autoPlay(this.state.autoplay);
        }}
      >
        <Box maxWidth="lg" className="relative">
          {!this.state.noControl && (
            <div
              className="base-carousel-control control-prev"
              onClick={() => {
                if (this.state.isSliding) return;

                this.stepTo(this.state.currentIndex - 1, true);
              }}
            >
              <i className="fas fa-angle-left"></i>
            </div>
          )}
          {!this.state.noControl && (
            <div
              className="base-carousel-control control-next"
              onClick={() => {
                if (this.state.isSliding) return;

                this.stepTo(this.state.currentIndex + 1, true);
              }}
            >
              <i className="fas fa-angle-right"></i>
            </div>
          )}
          {
            <div
              className="base-carousel"
              style={{
                paddingBottom: "24px",
                transitionDuration: `${this.state.transition}ms`,
                transform: `translateX(-${(this.itemWidth /
                  this.state.itemToShow) *
                  this.state.currentIndex}px)`
              }}
            >
              {this.state.childrenDom}
            </div>
          }
          {this.state.pagination && (
            <div className="base-carousel-pagination">
              {Array(
                Math.ceil(
                  this.state.defaultCarousels.length / this.state.itemToShow
                )
              )
                .fill(null)
                .map((it, pindex) => (
                  <div
                    x={`${(this.state.currentIndex %
                      this.state.defaultCarousels.length) /
                      this.state.itemToShow}`}
                    className={`base-carousel-pagination-item ${
                      parseInt(
                        (this.state.currentIndex %
                          this.state.defaultCarousels.length) /
                          this.state.itemToShow
                      ) === pindex
                        ? "active"
                        : ""
                    }`}
                    key={`#-pagination-${this.now}-${pindex}`}
                    p={pindex}
                    onClick={e => {
                      this.stepTo(
                        pindex * this.state.itemToShow +
                          this.state.defaultCarousels.length,
                        this.state.itemToShow
                      );
                    }}
                  ></div>
                ))}
            </div>
          )}
        </Box>
      </div>
    );
  }
}
export default BaseCarousel;
