import React from "react";
import SectionWrapper from "./../partials/SectionWrapper";
import Slider from "react-slick";
import { ClientContext } from "./../context/ClientProvider";
import { compareArray } from "../../../utils/helper";
import { MATERIAL_COLOR } from "../../../constant";
import { Skeleton } from "@material-ui/lab";

export default class CategorySection extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    categories: null,
    settings: {
      autoplay: false,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
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
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    }
  };

  componentDidMount() {
    const { categories } = this.context;

    if (categories) {
      this.setState(
        {
          categories
        },
        () => {
          if (this.state.categories.data === null) {
            this.state.categories.fetchData();
          }
        }
      );
    }
  }

  componentDidUpdate() {
    const { categories } = this.context;

    if (
      categories.data !== null &&
      this.state.categories &&
      (this.state.categories.data === null ||
        !compareArray(categories.data, this.state.categories.data, "id"))
    ) {
      this.setState({
        categories: {
          ...this.state.categories,
          data: categories.data
        }
      });
    }
  }

  toCategory = category => {
    this.context.toFilterProduct({category: category.alias})
  }

  NewProductSection = () => (
    <SectionWrapper
      title={"Cake Categories"}
      titleDes={"Our Cakes"}
      style={{ minHeight: "280px", paddingBottom: 0 }}
    >
      <Slider {...this.state.settings} className="base-carousel dots">
        {this.state.categories && this.state.categories.data
          ? this.state.categories.data.map(it => (
              <div key={`#carousel-category-${it.id}`}>
                <div
                  className="category-card"
                  style={{
                    backgroundColor:
                      MATERIAL_COLOR[
                        parseInt(Math.random() * MATERIAL_COLOR.length)
                      ]
                  }}

                  onClick={e => this.toCategory(it)}
                >
                  <div className="card-content">
                    <div className="card-title">{it.title}</div>
                    <div
                      className="card-image"
                      style={{ backgroundImage: `url(${it.thumbnail})` }}
                    />
                  </div>
                </div>
              </div>
            ))
          : Array(5)
              .fill(null)
              .map((it, index) => (
                <div key={`#carousel-category-${Date.now() + index}`}>
                  <div className="category-card">
                    <Skeleton
                      variant="rect"
                      animation="wave"
                      className="card-skeleton"
                    />
                  </div>
                </div>
              ))}
      </Slider>
    </SectionWrapper>
  );

  render() {
    return this.NewProductSection();
  }
}
