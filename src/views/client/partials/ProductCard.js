import React, { useContext } from "react";
import { PropTypes } from "prop-types";
import { ClientContext } from "./../context/ClientProvider";
import { Rating } from "@material-ui/lab";
import { ButtonBase, Box } from "@material-ui/core";
import LazyImage from "./../../../common/component/LazyImage";
import { withRouter } from "react-router-dom";
import ComponentWrapperHelper from "../../../common/component/ComponentWrapperHelper";

class ProductCard extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    product: null,
    type: null,
    id: -1,
    hightlighttitleregex: null,
    small: "",
    norate: null
  };

  componentDidMount() {
    const { products } = this.context;

    this.setState(
      {
        type: this.props.type || "grid",
        id: this.props.id || -1,
        hightlighttitleregex: this.props.hightlighttitleregex || null,
        small: this.props.small || "",
        norate: this.props.norate || null
      },
      () => {
        if (products.data !== null) {
          this.setState({
            product: products.data.find(it => it.id === this.state.id)
          });
        }
      }
    );
  }

  navigationToProductDetails = () => {
    this.props.history.push(`/product/${this.state.id}`);
  };

  hightlightTitle = title => {
    if (!this.state.hightlighttitleregex) return title;

    return title.replace(this.state.hightlighttitleregex, match => {
      return `<strong >${match}</strong>`;
    });
  };

  addToCart = () => {
    const {cart} = this.context;

    cart.control({product: this.state.product, amount: 1});
  };

  componentDidUpdate() {
    const { products } = this.context;

    if (products.data !== null && this.state.product) {
      this.setState({
        product: products.data.find(it => it.id === this.state.id)
      });
    }
  }

  render() {
    return (
      <ComponentWrapperHelper>
        <div className="animated faster slideInUp">
          {this.state.product && (
            <div
              className={`card-product ${this.state.type} ${
                this.state.small ? "small-size" : ""
              }`}
            >
              {this.state.type === "grid" ? (
                <div
                  className="card-product-image"
                  // style={{
                  //   backgroundImage: `url(${product.thumbnail})`
                  // }}
                >
                  <LazyImage
                    placeHolder={"/img/placeholder.png"}
                    src={this.state.product.thumbnail}
                    effect={"opacity"}
                    alt={this.state.product.thumbnail}
                  />
                  {this.state.product.discount !== 0 && (
                    <div className="card-product-discount">
                      <span>{this.state.product.discount}%</span>
                    </div>
                  )}
                  <div className="card-product-action">
                    <button
                      className="button-icon"
                      onClick={this.navigationToProductDetails}
                    >
                      <i className="pe-7s-search"></i>
                    </button>
                    <button className="button-icon">
                      <i className="far fa-heart"></i>
                    </button>
                    <button className="button-icon" onClick={this.addToCart}>
                      <i className="pe-7s-cart"></i>
                    </button>
                  </div>
                  {!this.state.norate && (
                    <div className="card-product-rate">
                      <Rating
                        precision={0.5}
                        value={this.state.product.rate}
                        size="small"
                        name="rating-product"
                        icon={<i className="far fa-star"></i>}
                        style={{ color: "#fa6e75" }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="card-product-image"
                  // style={{
                  //   backgroundImage: `url(${product.thumbnail})`
                  // }}
                >
                  <LazyImage
                    placeHolder={"/img/image-placeholder.webp"}
                    src={this.state.product.thumbnail}
                    effect={"opacity"}
                    alt={this.state.product.thumbnail}
                  />
                  {this.state.product.discount !== 0 && (
                    <div className="card-product-discount">
                      <span>{this.state.product.discount}%</span>
                    </div>
                  )}
                </div>
              )}
              <div className="card-product-content">
                <div
                  className="card-product-title"
                  dangerouslySetInnerHTML={{
                    __html: this.state.hightlighttitleregex
                      ? this.hightlightTitle(this.state.product.title)
                      : this.state.product.title
                  }}
                ></div>

                {this.state.type === "list" && !this.state.norate && (
                  <div className="card-product-rate">
                    <Rating
                      precision={0.5}
                      value={this.state.product.rate}
                      size="small"
                      name="rating-product"
                      icon={<i className="far fa-star"></i>}
                      style={{ color: "#fa6e75" }}
                    />
                  </div>
                )}
                {this.state.type === "list" && !this.state.small && (
                  <div className="card-product-short-des">
                    {this.state.product.short_description}
                  </div>
                )}
                <div className="card-product-price">
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
                {this.state.type === "list" && (
                  <Box display="flex" flexDirection="row">
                    <ButtonBase
                      className="btn-card-wrapper btn-add-to-cart-large"
                      onClick={this.addToCart}
                    >
                      <div className="btn-card">
                        Add to cart
                        <i className="fas fa-angle-right"></i>
                      </div>
                    </ButtonBase>

                    <div className="card-product-action">
                      {!this.state.small && (
                        <>
                          <button className="button-icon">
                            <i className="pe-7s-search"></i>
                          </button>
                          <button className="button-icon">
                            <i className="far fa-heart"></i>
                          </button>
                          <button className="button-icon btn-add-to-cart-small">
                            <i className="pe-7s-cart"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </Box>
                )}
              </div>
            </div>
          )}
        </div>
      </ComponentWrapperHelper>
    );
  }
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired
};

export default withRouter(ProductCard);
