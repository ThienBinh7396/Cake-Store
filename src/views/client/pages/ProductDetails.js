import React from "react";

import { withRouter, Link } from "react-router-dom";
import { ClientContext } from "./../context/ClientProvider";
import {
  Container,
  Grid,
  Box,
  Hidden,
  ButtonBase,
  withWidth
} from "@material-ui/core";
import { Skeleton, Rating } from "@material-ui/lab";
import AwesomeInput from "../../../common/component/AwesomeInput";
import { compareArray } from "../../../utils/helper";
import Slider from "react-slick";

const mapStuatusWithColor = {
  available: "#48ce4e",
  busy: "#ff8e00",
  unavailable: "#ff0101"
};

class ProductDetails extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    id: -1,
    product: null,
    products: null,
    gallery: null,
    amount: 1,
    review: {
      rate: 5,
      message: ""
    },

    settings: {
      autoplay: true,
      autoplaySpeed: 15000,
      cssEase: "linear",
      dots: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
    },
    navigationSettings: {
      dots: false,
      arrows: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      swipeToSlide: true,
      focusOnSelect: true,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3
          }
        }
      ]
    }
  };

  initialize() {
    const _id = Number(this.props.match.params.id);
    const { products } = this.context;

    if (!products.data) return;

    const _product = products.data.find(it => it.id === _id);

    if (!_product) {
      products.addOne(_id);
      return;
    }

    const _gallery = [
      { id: Date.now(), url: _product.thumbnail },
      ..._product.Galleries
    ];

    this.setState(
      {
        id: _id,
        product: _product,
        products,
        gallery: _gallery
      },
      () => {
        document.title = `Cake Stores - ${_product.title}`;
      }
    );
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    if (
      this.context.products.data !== null &&
      (this.state.id !== Number(this.props.match.params.id) ||
        (this.state.product === null &&
          !compareArray(
            this.state.products.data,
            this.context.products.data,
            "id"
          )))
    ) {
      this.initialize();
    }
  }

  getLeftContent() {
    return (
      <>
        {!this.state.gallery ? (
          <>
            <Skeleton animation="wave" variant="rect" height={320} />
            <Box display="flex" flexWrap="no-wrap" mt={3}>
              <Box mx={2} width="100%">
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width="100%"
                  height={110}
                />
              </Box>
              <Box mx={2} width="100%">
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width="100%"
                  height={110}
                />
              </Box>
              <Hidden smDown>
                <Box mx={2} width="100%">
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    width="100%"
                    height={110}
                  />
                </Box>
              </Hidden>
              <Hidden smDown>
                <Box mx={2} width="100%">
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    width="100%"
                    height={110}
                  />
                </Box>
              </Hidden>
            </Box>
          </>
        ) : (
          <>
            <Slider
              className="base-carousel"
              {...this.state.settings}
              asNavFor={this.navigationCarousel}
              ref={slider => (this.mainCarousel = slider)}
            >
              {this.state.gallery.map(it => (
                <div key={`#gallery-${it.id}`}>
                  <div
                    className="product-detail-gallery"
                    style={{ backgroundImage: `url(${it.url})` }}
                  />
                </div>
              ))}
            </Slider>
            <Slider
              {...this.state.navigationSettings}
              className="base-carousel carousel-product-gallery"
              asNavFor={this.mainCarousel}
              ref={slider => (this.navigationCarousel = slider)}
            >
              {this.state.gallery.map(it => (
                <div key={`#-pagination-${it.id}`}>
                  <div className={`product-detail-gallery-pagination`}>
                    <div
                      className={`product-detail-gallery-pagination-image`}
                      style={{
                        backgroundImage: `url(${it.url})`
                      }}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </>
        )}
      </>
    );
  }

  handleChangeAmount = value => {
    if (value < 1) value = 1;
    this.setState({
      amount: value
    });
  };

  addToCart = () => {
    const { cart } = this.context;

    cart.control({ product: this.state.product, amount: this.state.amount });
  };

  getRightContent() {
    return (
      <>
        {!this.state.product ? (
          <>
            <Box mb={1}>
              <Skeleton animation="wave" variant="rect" height="100px" />
            </Box>
            <Box mb={1}>
              <Skeleton animation="wave" width="100px" />
            </Box>
            <Box mb={1}>
              <Skeleton animation="wave" width="200px" />
            </Box>
            <Box mb={1}>
              <Skeleton animation="wave" variant="rect" height="200px" />
            </Box>
            <Box mb={1.5}>
              <Skeleton
                animation="wave"
                variant="rect"
                height="46px"
                style={{ borderRadius: "46px" }}
              />
            </Box>
          </>
        ) : (
          <>
            <div className="product-details-content">
              <div className="title">{this.state.product.title}</div>
              <div className="rate">
                <Rating
                  precision={0.5}
                  value={this.state.product.rate}
                  name="rating-product"
                  icon={<i className="far fa-star"></i>}
                  style={{ color: "#fa6e75" }}
                />
              </div>
              <div className="price">
                {this.state.product.discount !== 0 && (
                  <span className="origin">${this.state.product.price}</span>
                )}
                <span className="real">
                  $
                  {(
                    (this.state.product.price *
                      (100 - this.state.product.discount)) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div
                className="des"
                dangerouslySetInnerHTML={{
                  __html: this.state.product.description
                }}
              ></div>
              <div className="status">
                <strong>Status:</strong>
                <span
                  style={{
                    color: mapStuatusWithColor[this.state.product.status]
                  }}
                >
                  {this.state.product.status}
                </span>
              </div>
              <div className="status">
                <strong>Category:</strong>
                <span className="category">
                  {this.state.product.Categories.map((it, index) => (
                    <Link
                      key={`#category-product-${it.id}`}
                      to={`/store?category=${it.alias}`}
                    >
                      {index === 0 ? it.title : `, ${it.title}`}
                    </Link>
                  ))}
                </span>
              </div>
              <Box display="flex" alignItems="center" mt={4}>
                <div className="amount">
                  <AwesomeInput
                    value={this.state.amount}
                    onChange={this.handleChangeAmount}
                    type="number"
                    min="1"
                  />
                </div>
                <div className="card-product-action">
                  <button className="button-icon">
                    <i className="far fa-heart"></i>
                  </button>
                </div>
              </Box>

              <div className="add">
                {" "}
                <ButtonBase
                  className="btn-card-wrapper btn-add-to-cart-large"
                  onClick={this.addToCart}
                >
                  <div className="btn-card">
                    Add to cart
                    <i className="fas fa-angle-right"></i>
                  </div>
                </ButtonBase>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  render() {
    return (
      <Box component={Container} pt={4} maxWidth="lg">
        <Grid container className="product-detail">
          <Box
            component={Grid}
            px={this.props.width === "xs" ? 0 : 3}
            py={3}
            pt={0}
            item
            xs={12}
            sm={12}
            md={5}
          >
            {this.getLeftContent()}
          </Box>
          <Box
            component={Grid}
            px={this.props.width === "xs" ? 0 : 3}
            pb={6}
            pt={0}
            item
            xs={12}
            sm={12}
            md={7}
          >
            {this.getRightContent()}
          </Box>
        </Grid>
        <Grid item>
          <ul className="tabWrapper">
            <li className="active">Reviews</li>
          </ul>
          <div className="review-content">
            <Grid container>
              <Grid item md={5}>
                <div
                  className="client-feedback-form review-form"
                  style={{ textAlign: "left" }}
                >
                  <div className="client-form-title">Send Reviews</div>
                  <div className="client-form-control rate">
                    <label className="required">Rating:</label>
                  </div>
                  <Rating
                    precision={0.5}
                    value={this.state.review.rate}
                    name="rating-reviews"
                    icon={<i className="far fa-star"></i>}
                    style={{ color: "#fa6e75" }}
                  />
                  <div className="client-form-control">
                    <label className="required">Your Message</label>
                    <div
                      className="textarea"
                      contentEditable="true"
                      dangerouslySetInnerHTML={{
                        __html: this.state.review.message
                      }}
                      onInput={e => {
                        this.setState({
                          review: {
                            ...this.state.review,
                            message: e.target.innerHTML
                          }
                        });
                      }}
                    />
                  </div>

                  <ButtonBase className="btn-card-wrapper">
                    <div
                      className="btn-card"
                      onClick={e => {
                        console.log(this.state.review);
                      }}
                    >
                      Send To Us
                      <i className="fas fa-paper-plane"></i>
                    </div>
                  </ButtonBase>
                </div>
              </Grid>
              <Grid item md={7}></Grid>
            </Grid>
          </div>
        </Grid>
      </Box>
    );
  }
}
export default withWidth()(withRouter(ProductDetails));
