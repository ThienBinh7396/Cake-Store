import React, { Component } from "react";
import Carousel from "../../../common/component/BaseCarousel";
import { Grid, Box, ButtonBase } from "@material-ui/core";
import { PropTypes } from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { CLIENT_NAV } from "./../../../constant/index";
import LazyImage from "./../../../common/component/LazyImage";

const carousels = [
  {
    image: "http://cakeart.foobla.com/images/2016/04/08/slider2.png",
    title: "Celebration Cake",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "http://cakeart.foobla.com/images/2016/04/08/1.png",
    title: "Strawberry Cupcakes",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "http://cakeart.foobla.com/images/2016/03/23/cake.png",
    title: "Pretty Cake",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "/img/carousel-cake.png",
    title: "Spiced Cider Punch",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "/img/carousel-cake1.png",
    title: "Agave Holiday Ham Glaze",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
];

class BannerHeader extends Component {
  constructor(props) {
    super(props);
    this.now = btoa(`${new Date().getTime()}`);
  }

  state = {
    background: "/img/bg-slide-1.jpg",
    color: null,
    type: null,
    nav: []
  };

  componentDidMount() {
    this.setState({
      background: this.props.background || "/img/bg-slide-1.jpg",
      color: this.props.color || null,
      type: this.props.type || null,
      nav: this.getNav()
    });
  }

  getNav() {
    let _match = this.props.match.url.split("/").filter(it => it);
    console.log(_match);

    let nav = _match.reduce((arr, current, index) => {
      let _find = CLIENT_NAV.find(it => it.route === current);

      if (index === 0 && current !== "home") {
        arr.push({ text: "Home", to: "/home", disable: false });
      }

      if (_find && index !== _match.length - 1) {
        return [...arr, { text: _find.text, to: _find.path, disable: false }];
      } else {
        return [...arr, { text: current, to: current, disable: true }];
      }
    }, []);

    console.log(nav);
    return nav;
  }

  render() {
    return (
      <div className="banner-header">
        <div
          className="banner-header-image"
          style={{
            backgroundImage: `url(${this.state.background})`
          }}
        ></div>
        <div
          className="banner-header-content"
          style={{ backgroundColor: this.state.color }}
        >
          {this.state.type === "title-with-nav" && (
            <>
              <div className="banner-header-title">{this.props.title}</div>
              <div className="banner-header-nav">
                {this.state.nav.map(it => (
                  <div key={`#banner-header-${it.text}`}>
                    {it.disable ? (
                      <span>{it.text}</span>
                    ) : (
                      <Link to={it.to}>{it.text}</Link>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {this.state.type === "carousel" && (
            <Carousel stoponhover>
              {carousels.map((it, index) => (
                <Grid
                  container
                  alignItems="center"
                  key={index}
                  style={{ padding: "0 24px 142px" }}
                >
                  <Grid item className="image">
                    <LazyImage
                      src={it.image}
                      alt={it.title}
                      effect={"opacity"}
                    />
                  </Grid>
                  <Grid item className="content">
                    <Box
                      style={{
                        maxWidth: "520px",
                        marginTop: "24px"
                      }}
                    >
                      <div className="base-carousel-item-title awesome-font">
                        {it.title}
                      </div>
                      <div className="base-carousel-item-description">
                        {it.description}
                      </div>
                      <ButtonBase className="base-carousel-item-btn">
                        <i className="pe-7s-angle-right-circle"></i>
                        <span>More Information</span>
                      </ButtonBase>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    );
  }
}

BannerHeader.propTypes = {
  type: PropTypes.string.isRequired
};

export default withRouter(BannerHeader);
