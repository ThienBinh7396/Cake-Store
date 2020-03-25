import React from "react";

import { withRouter, Link } from "react-router-dom";
import { ClientContext } from "./../context/ClientProvider";
import {
  Container,
  Grid,
  Box,
  Hidden,
  ButtonBase,
  withWidth,
  FormControlLabel,
  Switch,
  CircularProgress,
  TextareaAutosize
} from "@material-ui/core";
import { Skeleton, Rating } from "@material-ui/lab";
import AwesomeInput from "../../../common/component/AwesomeInput";
import { compareArray, validateEmail } from "../../../utils/helper";
import Slider from "react-slick";

import ExpandedView from "../partials/ExpandedView";

import { REVIEW_LABELS } from "../../../constant";
import { withSnackbar } from "notistack";
import SnackbarLayout from "../partials/SnackbarLayout";
import ListProductReview from "../partials/ListProductReview";
import WrapperLoadingComponent from "../../../common/component/WrapperLoadingComponent";
import TextareaAutoHeight from "../../../common/component/TextareaAutoHeight";

const mapStuatusWithColor = {
  available: "#48ce4e",
  busy: "#ff8e00",
  unavailable: "#ff0101"
};

class ProductDetails extends React.PureComponent {
  static contextType = ClientContext;

  constructor(props) {
    super(props);

    this._handleChangeAnonymousReview = this._handleChangeAnonymousReview.bind(
      this
    );
    this._handleChangeRateEmail = this._handleChangeRateEmail.bind(this);
    this._handleChangeMessageReview = this._handleChangeMessageReview.bind(
      this
    );
    this._handleChangeRateReview = this._handleChangeRateReview.bind(this);
    this._handleChangeRateHover = this._handleChangeRateHover.bind(this);
    this._sendReview = this._sendReview.bind(this);
  }

  state = {
    id: -1,
    product: null,
    productReview: null,
    products: null,
    gallery: null,
    amount: 1,
    review: {
      handling: false,
      rate: 5,
      message: "",
      email: "",
      anonymous: false,
      hover: -1
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
    const { products, productReview, client } = this.context;

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
        productReview,
        gallery: _gallery,
        review: {
          ...this.state.review,
          email: client.data ? client.data.email : (client.tempEmailInStorage || "") 
        }
      },
      () => {
        document.title = `Cake Stores - ${_product.title}`;
      }
    );
  }

  componentDidMount() {
    this.initialize();
  }

  _clearProductReview = () => {
    this.context.productReview.update(null);
  };

  _checkProductReview = () => {
    if (!this.state.productReview) return;

    const { productReview } = this.context;

    let _updateProductReview = null;

    let _checkUpdate = false;

    if (
      (productReview.targetReview === null ||
        this.state.productReview.targetReview === null) &&
      this.state.productReview.targetReview !== productReview.targetReview
    ) {
      _updateProductReview = productReview;
      _checkUpdate = true;
    }

    if (
      productReview.targetReview !== null &&
      this.state.productReview.targetReview !== null &&
      this.state.productReview.targetReview.id !== productReview.targetReview.id
    ) {
      _updateProductReview = productReview;
      _checkUpdate = true;
    }
    if (_checkUpdate) {
      this.setState(
        {
          productReview: _updateProductReview
        },
        () => {
          const txt = document.getElementById("message-form");

          txt && txt.focus();
        }
      );
    }
  };

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

    this._checkProductReview();
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
                  readOnly
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

  _handleChangeReview(_review) {
    this.setState({
      review: {
        ...this.state.review,
        ..._review
      }
    });
  }

  _handleChangeAnonymousReview(e) {
    this._handleChangeReview({ anonymous: e.target.checked });
  }

  _handleChangeRateEmail(e) {
    this._handleChangeReview({ email: e.target.value });
  }

  _handleChangeMessageReview(e) {
    this._handleChangeReview({ message: e.target.value });
  }

  _handleChangeRateReview(e) {
    this._handleChangeReview({ rate: Number(e.target.value) });
  }

  _handleChangeRateHover(event, newHover) {
    console.log(newHover);

    this._handleChangeReview({ hover: newHover });
  }

  _showToast({ type, title, content, icon }) {
    this.props.enqueueSnackbar(title, {
      variant: "default",
      anchorOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      content: (key, message) => {
        console.log("key : ", key);
        return (
          <SnackbarLayout type={type} icon={icon} id={key} message={message}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </SnackbarLayout>
        );
      }
    });
  }

  _sendReview(e) {
    const { review } = this.state;

    const { axios, client, productReview } = this.context;

    if (!review.anonymous && `${review.email}`.trim().length === 0) {
      this._showToast({
        type: "warning",
        icon: true,
        title: "Reported",
        content: "Email is required!"
      });
      return;
    }

    if (!review.anonymous && !validateEmail(review.email)) {
      this._showToast({
        type: "error",
        icon: true,
        title: "Reported",
        content: "Email is invalid!"
      });
      return;
    }

    this._handleChangeReview({
      handling: true
    });

    axios
      .connect({
        url: "/client/product/createComment",
        method: "POST",
        data: {
          productId: this.state.product.id,
          anonymous: review.anonymous,
          email: review.anonymous ? client.anonymous : review.email,
          message: review.message,
          signIn: !!client.data,
          parentId:
            this.context.productReview &&
            this.context.productReview.targetReview
              ? this.context.productReview.targetReview.id
              : 0,
          rate: review.rate
        }
      })
      .then(rs => {
        let { data } = rs;

        this._showToast({
          type: data.type,
          content: data.message,
          icon: true,
          title: "Reported!"
        });

        if (data.type === "success") {
          if(!client.data && (!client.tempEmailInStorage || client.tempEmailInStorage !== review.email)){
            client.updateTempEmail(review.email)
          }

          productReview.updateProductReviewToProduct(
            this.state.product.id,
            data.data
          );
        }
        this._handleChangeReview({
          handling: false
        });
      })
      .catch(err => {
        console.log(err);
        this._handleChangeReview({
          handling: false
        });
      });

    if (`${review.message}`.trim().length === 0) {
      this._showToast({
        type: "warning",
        icon: true,
        title: "Reported",
        content: "Send to us something!"
      });
      return;
    }
  }

  render() {
    return (
      <div>
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
        </Box>
        <Container>
          <ul className="tabWrapper">
            <li className="active">Reviews</li>
          </ul>
        </Container>
        <div
          className="review-content fixed-background"
          style={{ backgroundImage: "url(/img/bg-feedback.jpg)" }}
        >
          <Container maxWidth="lg">
            <Grid container>
              <Grid
                item
                lg={7}
                md={6}
                sm={12}
                xs={12}
                className="pos-relative "
              >
                <div className="overlay" />
                <WrapperLoadingComponent loading={!this.state.product}>
                  <div className="pos-relative pb-24">
                    {!this.state.product ||
                    this.state.product.ProductReviews.length === 0 ? (
                      <div className="no-comment py-24">
                        <img
                          alt="no-comment"
                          src="/img/no-comment.png"
                          width="260"
                        />
                        <div className="title">No comment yet.</div>
                        <div className="sub-title">
                          Be the first to comment on the publication
                        </div>
                      </div>
                    ) : (
                      <ListProductReview productId={this.state.product.id} />
                    )}
                  </div>
                </WrapperLoadingComponent>
              </Grid>
              <Grid item lg={5} md={6} sm={12} xs={12}>
                <form
                  name="reviewForm"
                  className="client-feedback-form review-form"
                  style={{ textAlign: "left" }}
                >
                  <FormControlLabel
                    className="switch-anonymous"
                    control={
                      <Switch
                        checked={this.state.review.anonymous}
                        onChange={this._handleChangeAnonymousReview}
                        value={this.state.review.anonymous}
                        color="secondary"
                      />
                    }
                    label={<small>Anonymous</small>}
                  />

                  <div className="client-form-title">Send Reviews</div>

                  <ExpandedView
                    expanded={
                      this.state.productReview &&
                      this.state.productReview.targetReview
                        ? true
                        : false
                    }
                  >
                    <div className="reply pos-relative">
                      <div className="reply-info">
                        <i className="fas fa-reply mr-2"></i>
                        <strong>
                          {this.state.productReview &&
                          this.state.productReview.targetReview
                            ? this.state.productReview.targetReview.Customer
                                .name ||
                              this.state.productReview.targetReview.Customer
                                .email
                            : ""}
                        </strong>
                      </div>
                      <div
                        className="close pos-absolute "
                        onClick={this._clearProductReview}
                      >
                        <i className="fas fa-times" />
                      </div>
                      <div className="content mt-2">
                        {this.state.productReview &&
                        this.state.productReview.targetReview
                          ? this.state.productReview.targetReview.content
                          : ""}
                      </div>
                    </div>
                  </ExpandedView>
                  <ExpandedView
                    expanded={
                      !(
                        this.state.productReview &&
                        this.state.productReview.targetReview
                      )
                    }
                  >
                    <div className="client-form-control rate">
                      <label className="required">Rating</label>
                    </div>
                    <div className="rating-wrapper">
                      <Rating
                        precision={0.5}
                        value={this.state.review.rate}
                        name="rating-reviews"
                        icon={<i className="far fa-star"></i>}
                        onChange={this._handleChangeRateReview}
                        onChangeActive={this._handleChangeRateHover}
                        style={{ color: "#fa6e75" }}
                      />
                      {this.state.review.rate !== null && (
                        <label>
                          {
                            REVIEW_LABELS[
                              this.state.review.hover !== -1
                                ? this.state.review.hover
                                : this.state.review.rate
                            ]
                          }
                        </label>
                      )}
                    </div>
                  </ExpandedView>

                  <ExpandedView min={0} expanded={!this.state.review.anonymous}>
                    <div className="client-form-control">
                      <label className="required">Email</label>
                      <div className="client-form-control-wrapper">
                        <input
                          type="text"
                          value={this.state.review.email}
                          onChange={this._handleChangeRateEmail}
                        />
                        <div className="client-form-control-line" />
                      </div>
                    </div>
                  </ExpandedView>

                  <div className="client-form-control">
                    <label className="required">Your Message</label>

                    <div className="client-form-control-wrapper">
                      <TextareaAutosize
                        className="textarea"
                        value={this.state.review.message}
                        name="messageForm"
                        id="message-form"
                        onChange={this._handleChangeMessageReview}
                      />
                      <div className="client-form-control-line" />
                    </div>
                  </div>

                  <ButtonBase className="btn-card-wrapper">
                    <div
                      className="btn-awesome primary"
                      onClick={this._sendReview}
                    >
                      Send To Us
                      {this.state.review.handling ? (
                        <CircularProgress
                          style={{ margin: "-2px 0 0 8px " }}
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <i className="fas fa-paper-plane"></i>
                      )}
                    </div>
                  </ButtonBase>
                </form>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}
export default withWidth()(withRouter(withSnackbar(ProductDetails)));
