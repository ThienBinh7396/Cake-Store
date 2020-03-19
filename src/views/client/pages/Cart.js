import React from "react";
import BannerHeader from "../partials/BannerHeader";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid
} from "@material-ui/core";
import AwesomeInput from "../../../common/component/AwesomeInput";
import { withSnackbar } from "notistack";
import LayoutNotificationCartAction from "./../partials/LayoutNotificationCartAction";
import { ClientContext } from "./../context/ClientProvider";
import { withRouter } from "react-router-dom";

class Cart extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    nav: null,
    cart: null
  };

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

  componentDidMount() {
    const nav = [
      { text: "Home", to: "/home", disable: false, className: "" },
      {
        text: "Cart",
        to: "/cart",
        disable: true,
        className: ""
      }
    ];

    const { cart } = this.context;

    this.setState({
      nav,
      cart
    });
  }

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

  returnToStore = () => {
    this.props.history.push("/store");
  };

  updateProductInCart = (product, amount) => {
    console.log("UPDATE CART: ", product, amount);

    this.state.cart.control({
      type: "update",
      product,
      amount
    });
  };

  removeProductInCart = ({ product, amount }) => {
    this.state.cart.remove({ product });
    this.showToast({ product, amount });
  };

  _toCheckout = () => {
    this.props.history.push('/checkout');
  }

  renderRow = _cart => {
    const { product, amount } = _cart;

    return (
      <TableRow key={`#cart-table-${product.id}`}>
        <TableCell data-title="Title">{product.title}</TableCell>
        <TableCell data-title="Thumbnail">
          <img width="72px" alt="thumbnail" src={product.thumbnail} />
        </TableCell>
        <TableCell data-title="Price">${product.price}</TableCell>
        <TableCell data-title="Discounts">
          <span className="price">
            ${((product.price * (100 - product.discount)) / 100).toFixed(2)}
          </span>
          &nbsp; (-
          {product.discount}%)
        </TableCell>
        <TableCell data-title="Quantity">
          <AwesomeInput
            value={amount}
            onChange={value => {
              this.updateProductInCart(product, value);
            }}
            type="number"
            min="1"
          />
        </TableCell>
        <TableCell data-title="Total" style={{ width: "110px" }}>
          <strong className="price total">
            $
            {(
              ((product.price * (100 - product.discount)) / 100) *
              amount
            ).toFixed(2)}
          </strong>
        </TableCell>
        <TableCell>
          <div
            className="remove"
            onClick={e => {
              this.removeProductInCart({ product, amount });
            }}
          >
            <i className="pe-7s-close" />
          </div>
          <button className="btn-awesome primary remove-mobile">Remove</button>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    return (
      <>
        <BannerHeader
          background="/img/bg_header_4.jpg"
          color="#29203ccf"
          type="title-with-custom-nav"
          title={"Cart"}
          nav={this.state.nav}
        />

        <Container maxWidth="lg" className="py-24">
          {this.state.cart &&
            (this.state.cart.data === null ||
              this.state.cart.data.length === 0) && (
              <div className="alert alert-empty-cart">
                <div className="alert-icon">
                  <i className="fas fa-info-circle" />
                </div>
                <div className="alert-content">
                  <div>Your card is empty</div>{" "}
                  <button
                    className="ml-4 btn-awesome-outline primary"
                    onClick={this.returnToStore}
                  >
                    Return to store
                  </button>
                </div>
              </div>
            )}

          {this.state.cart &&
            this.state.cart.data &&
            this.state.cart.data.length > 0 && (
              <TableContainer>
                <Table aria-label="simple table" className="cart-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>All products</TableCell>
                      <TableCell>Thumbnail</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.cart.data.map(it => this.renderRow(it))}

                    <TableRow className="cart-summary">
                      <TableCell colSpan={4}></TableCell>
                      <TableCell colSpan={3}>
                        <div className="cart-summary-wrapper">
                          <div className="cart-summary-title">Cart Sumary</div>
                          <div className="cart-summary-content">
                            <div className="row">
                              <label>Subtotal: </label>
                              <div>${this.state.cart.total.toFixed(2)}</div>
                            </div>
                            <div className="row">
                              <label>Delivery: </label>
                              <div>Free</div>
                            </div>
                            <div className="row">
                              <label>Total: </label>
                              <div>${this.state.cart.total.toFixed(2)}</div>
                            </div>
                          </div>
                          <button className="btn-awesome primary cart-summary-checkout"
                            onClick={this._toCheckout}
                          >
                            Checkout
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </Container>
      </>
    );
  }
}

export default withRouter(withSnackbar(Cart));
