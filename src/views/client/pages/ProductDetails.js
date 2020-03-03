import React, { Component } from "react";

import Carousel from "../../../common/component/BaseCarousel";
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

const mapStuatusWithColor = {
  available: "#48ce4e",
  busy: "#ff8e00",
  unavailable: "#ff0101"
};

class ProductDetails extends Component {
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

    this.setState({
      id: _id,
      product: _product,
      products,
      gallery: _gallery
    });
  }

  compareArray = (arr1, arr2, field) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length === 0 && arr2.length === 0) return true;
    if (arr1.length !== arr2.length) return false;

    return arr1.every((value, index) => {
      return field
        ? value[field] === arr2[index][field]
        : value === arr2[index];
    });
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    if (
      this.context.products.data !== null &&
      (this.state.id !== Number(this.props.match.params.id) ||
        (this.state.product === null &&
          !this.compareArray(
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
            <Carousel
              autoplay={false}
              nocontrol
              pagination
              paginationWithImage={this.state.gallery}
              className="product-detail-carousel"
            >
              {this.state.gallery.map(it => (
                <div
                  className="product-detail-gallery"
                  key={`#gallery-${it.id}`}
                  style={{ backgroundImage: `url(${it.url})` }}
                />
              ))}
            </Carousel>
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
                <ButtonBase className="btn-card-wrapper btn-add-to-cart-large">
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
        <Grid container>
          <Box
            component={Grid}
            px={this.props.width === "xs" ? 0 : 3}
            py={3}
            pt={0}
            item
            xs={12}
            sm={12}
            md={6}
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
            md={6}
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
