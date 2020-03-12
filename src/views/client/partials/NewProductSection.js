import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import SectionWrapper from "./SectionWrapper";
import Slider from "react-slick";
import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ProductCard from "./ProductCard";

export default class NewProductSection extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    newProducts: null,
    settings: {
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 4,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 960,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 2
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
      ]
    }
  };

  componentDidUpdate() {
    const { products } = this.context;

    if (products.newProducts.data !== null && this.state.newProducts === null) {
      this.setState({
        newProducts: products.newProducts
      });
    }
  }

  render() {
    return (
      <SectionWrapper
        title={"New Products"}
        titleDes={"Sweet Cakes"}
        style={{ minHeight: "280px" }}
      >
        <Slider {...this.state.settings} className="base-carousel dots">
          {!this.state.newProducts || !this.state.newProducts.data
            ? [1, 2, 3, 4].map((it, index) => (
                <Box
                  py={2}
                  px={1}
                  width={"100%"}
                  key={`#skeleton-section-product-${index}`}
                >
                  <Skeleton variant="rect" animation="wave" height={282} />
                  <Skeleton
                    animation="wave"
                    width="60%"
                    style={{ marginTop: "8px" }}
                  />
                  <Skeleton variant="rect" animation="wave" height={18} />
                </Box>
              ))
            : this.state.newProducts.data.map((it, index) => {
                return <ProductCard id={it.id} key={`#product-${it.id}`} />;
              })}
        </Slider>
      </SectionWrapper>
    );
  }
}
