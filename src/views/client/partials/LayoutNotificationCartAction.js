import React from "react";
import { withSnackbar } from "notistack";
import { ClientContext } from "./../context/ClientProvider";
import {
  Collapse,
  IconButton,
  Card,
  CardActions
} from "@material-ui/core";
import { stopPropagationEvent } from "../../../utils/helper";

class LayoutNotificationCartAction extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    key: null,
    message: null,
    expand: true,
    product: null,
    amount: null
  };

  componentDidMount() {
    const { id, message, amount, product } = this.props;

    let _update = {
      key: id,
      amount,
      message,
      product
    };

    this.setState({
      ..._update
    });
  }

  handleExpandClick = () => {
    this.setState({
      expand: !this.state.expand
    });
  };

  handleDismiss = () => {
    this.props.closeSnackbar(this.state.key);
  };

  navigationToProductDetails = product => {
    // this.props.history.push(`/product/${product.id}`);
  };

  removeProduct = (e, product) => {
    stopPropagationEvent(e);

    if (this.state.cart !== null) {
      this.state.cart.remove({ product });
    }
  };

  render() {
    return (
      <Card className="cart-snackbar">
        <CardActions className="header">
          <div className="title">
            {this.state.message}
          </div>
          <div className="icons">
            <IconButton
              className={`expanded ${!this.state.expand ? 'hide' : ''}`}
              aria-label="Show more"
              onClick={this.handleExpandClick}
            >
              <i className="fas fa-angle-down" />
            </IconButton>
            <IconButton onClick={this.handleDismiss}>
              <i className="fas fa-times" />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={this.state.expand} timeout="auto" unmountOnExit>
          {this.state.product && (
            <div className="cart-content-row">
              <div
                className="image"
                style={{
                  backgroundImage: `url(${this.state.product.thumbnail})`
                }}
              />
              <div className="content">
                <div
                  className="title"
                  onClick={e =>
                    this.navigationToProductDetails(this.state.product)
                  }
                >
                  {this.state.product.title}
                </div>
                <div className="info">
                  <div>Quality: {this.state.amount}</div>
                  <div>
                    Total: $
                    <span className="price">{(
                      ((Number(`${this.state.amount}`) *
                        (100 - this.state.product.discount)) /
                        100) *
                      this.state.product.price
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Collapse>
      </Card>
    );
  }
}

export default withSnackbar(LayoutNotificationCartAction);
