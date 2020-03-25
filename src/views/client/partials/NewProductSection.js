import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import SectionWrapper from "./SectionWrapper";
import Slider from "react-slick";
import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ProductCard from "./ProductCard";
import { compareArray } from "../../../utils/helper";

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
        }
      ]
    }
  };

  componentDidMount() {
    this.setState({
      newProducts: this.context.products
    });
  }

  componentDidUpdate() {
    const { newProducts } = this.context.products;

    if (
      newProducts.data &&
      (!this.state.newProducts.data ||
       ! compareArray(newProducts.data, this.state.newProducts.data, "id"))
    ) {
      console.log("Update new Products: ");

      this.setState({
        newProducts: {
          ...this.state.newProducts,
          data: newProducts.data
        }
      });
    }
  }

  render() {
    console.log("RENDER NEW PRODUCTS");

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
                return (
                  <ProductCard noAnimate id={it.id} key={`#product-${it.id}`} />
                );
              })}
        </Slider>
      </SectionWrapper>
    );
  }
}
