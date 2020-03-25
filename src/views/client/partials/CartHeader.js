import React from "react";
import { ClientContext } from "../context/ClientProvider";
import { PropTypes } from "prop-types";
import { Menu } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import RcQueueAnim from "rc-queue-anim";
import PerfectScrollbar from "@opuscapita/react-perfect-scrollbar";

import LayoutNotificationCartAction from "../partials/LayoutNotificationCartAction";
import { withSnackbar } from "notistack";

import { stopPropagationEvent } from "../../../utils/helper";

import _ from "lodash";

class CartHeader extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    cart: null,
    height: 0,
    heightContent: 0
  };

  componentDidMount() {
    console.log(this.props.anchorEl);

    const { cart } = this.context;

    this.setState(
      {
        cart
      },
      () => {
        if (this.state.cart.data === null) {
          this.state.cart.getDataFromLocal();
        }
      }
    );
  }

  showToast = ({ product, amount }) => {
    this.props.enqueueSnackbar("Product is removed", {
      variant: "default",
      anchorOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      content: (key, message) => {
        console.log("key : ", key);
        return (
          <LayoutNotificationCartAction
            id={key}
            message={message}
            product={product}
            amount={amount}
          />
        );
      }
    });
  };

  compareCart = (cart1, cart2) => {
    if (cart1 === null && cart2 === null) {
      return true;
    }

    if (cart1 === null || cart2 === null || cart1.length !== cart2.length) {
      return false;
    }

    let mainArr = cart1.length > cart2.length ? cart1 : cart2;
    let compareArr = cart1.length <= cart2.length ? cart1 : cart2;

    return mainArr.every((it, index) => {
      return (
        it.product.id === compareArr[index].product.id &&
        it.amount === compareArr[index].amount
      );
    });
  };

  componentDidUpdate() {
    const { cart } = this.context;

    if (
      cart.data !== null &&
      (this.state.cart.data === null ||
        !this.compareCart(this.state.cart.data, cart.data))
    ) {
      this.setState(
        {
          cart: {
            ...cart,
            data: cart.data
          }
        },
        () => {
          let _height =
            this.state.cart !== null && this.state.cart.data.length !== 0
              ? this.state.cart.data.length * 95
              : 261;
          let _heightContent = _height;

          console.log("Height: ", _height);
          _height = _height > 261 ? 261 : _height;
          console.log("Height123123: ", _height);

          this.setState({
            height: _height,
            heightContent: _heightContent
          });
        }
      );
    }

    if (this.state.cart !== null && this.state.cart.total !== cart.total) {
      this.setState({
        cart: {
          ...cart,
          total: cart.total
        }
      });
    }
  }

  navigationToProductDetails = product => {
    this.props.history.push(`/product/${product.id}`);
  };

  removeProduct = (e, product, amount) => {
    stopPropagationEvent(e);

    if (this.state.cart !== null) {
      this.state.cart.remove({ product }, () => {
        this.showToast({ product, amount });

        try {
          this._scrollBarCartHeaderContentRef.ps.update();
        } catch (error) {}
      });
    }
  };

  renderCartRow = cartRow => {
    const { product, amount } = cartRow;

    return (
      <div className="cart-content-row" key={`#cart-content-row-${product.id}`}>
        <div
          className="image"
          style={{ backgroundImage: `url(${product.thumbnail})` }}
        />
        <div className="content">
          <div
            className="title"
            onClick={e => this.navigationToProductDetails(product)}
          >
            {product.title}
          </div>
          <div className="info">
            <div>Quality: {amount}</div>
            <div>
              Total: $
              <span className="price">
                {(
                  ((Number(`${amount}`) * (100 - product.discount)) / 100) *
                  product.price
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div
          className="remove"
          onClick={e => this.removeProduct(e, product, amount)}
        >
          <i className="pe-7s-close" />
        </div>
      </div>
    );
  };

  toCart = () => {
    this.props.history.push("/cart");
  };

  render() {
    return (
      this.props.anchorEl.current && (
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          anchorEl={this.props.anchorEl.current}
          keepMounted
          open={this.props.open}
          onClose={this.props.handleClose}
          className="cart-header"
        >
          <PerfectScrollbar
            className="cart-header-content"
            style={{ height: this.state.height }}
            ref={ref => (this._scrollBarCartHeaderContentRef = ref)}
          >
            <div
              className="wrapper"
              style={{ height: this.state.heightContent }}
            >
              {this.state.cart ? (
                <>
                  {!this.state.cart.data ||
                  this.state.cart.data.length === 0 ? (
                    <div className="empty-cart">
                      <img src="/img/empty_bag.png" alt="empty-cart" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <RcQueueAnim
                      animConfig={[
                        { translateX: [0, 310] },
                        { translateX: [0, 310] }
                      ]}
                    >
                      {this.state.cart.data.map(it => this.renderCartRow(it))}
                    </RcQueueAnim>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </PerfectScrollbar>
          <div className="cart-header-total">
            <div className="row">
              <label>Number of items:</label>
              <span>
                {this.state.cart && this.state.cart.data
                  ? this.state.cart.data.length
                  : 0}
              </span>
            </div>
            <div className="row">
              <label>Item Total:</label>
              <span>
                $
                <span>{`${
                  this.state.cart ? this.state.cart.total.toFixed(2) : 0
                }`}</span>
              </span>
            </div>
          </div>
          <button
            className="btn-awesome block primary view-cart"
            onClick={this.toCart}
          >
            View Cart
          </button>
        </Menu>
      )
    );
  }
}

CartHeader.propTypes = {
  anchorEl: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default withRouter(withSnackbar(CartHeader));
