import React from "react";
import Slider from "react-slick";
import { Grid, Box, ButtonBase } from "@material-ui/core";
import LazyImage from "./../../../common/component/LazyImage";

export default class CarouselHeader extends React.PureComponent {
  state = {
    settings: {
      autoplay: false,
      infinite: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1
    },
    carousel: [
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
    ]
  };

  render() {
    return (
      <Slider {...this.state.settings} className="base-carousel">
        {this.state.carousel.map((it, index) => (
          <div key={`#carousel-header-${index}`}>
            <Grid
              container
              alignItems="center"
              style={{ padding: "0 24px 124px" }}
              className="carousel-header"
            >
              <Grid item lg={7} md={6} sm={5} xs={12}>
                <LazyImage src={it.image}  alt={it.title} effect={"opacity"} />
              </Grid>
              <Grid item lg={5} md={6} sm={7} xs={12}>
                <Box
                  style={{
                    maxWidth: "520px",
                    marginTop: "24px"
                  }}
                >
                  <div className="base-carousel-item-title">
                    {it.title}
                  </div>
                  <div className="base-carousel-item-description">
                    {it.description}
                  </div>
                  <ButtonBase className="base-carousel-item-btn">
                    <i className="pe-7s-angle-right-circle mr-2"></i>
                    <span>More Information</span>
                  </ButtonBase>
                </Box>
              </Grid>
            </Grid>
          </div>
        ))}
      </Slider>
    );
  }
}
