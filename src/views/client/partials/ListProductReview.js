import React from "react";

import PropTypes from "prop-types";
import { ClientContext } from "./../context/ClientProvider";

import { MATERIAL_COLOR } from "../../../constant";
import { Rating } from "@material-ui/lab";

import { formatDate, stopPropagationEvent } from "../../../utils/helper";
import RcQueueAnim from "rc-queue-anim";

export default class ListProductReview extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    id: -1,
    product: null,
    containerId: "list-product-review"
  };

  componentDidMount() {
    const { products } = this.context;

    const _product = products.data.find(it => it.id === this.props.productId);

    this.setState({
      id: this.props.productId,
      product: _product
    });
  }

  _handleTargetReview = _review => {
    const { productReview } = this.context;

    let _update =
      productReview.targetReview && productReview.targetReview.id === _review.id
        ? null
        : _review;

    this.context.productReview.update(_update);
  };

  _renderRow = _review => {
    return (
      <div
        className="product-review-item"
        key={`#product-review-${_review.id}`}
      >
        <div
          style={{
            backgroundColor:
              MATERIAL_COLOR[parseInt(Math.random() * MATERIAL_COLOR.length)]
          }}
          className={["thumbnail", _review.Customer.anonymous && "p-2"].join(
            " "
          )}
        >
          <img
            containertarget={`#${this.state.containerId}`}
            width="48px"
            src={_review.Customer.thumbnail}
            alt={"customer"}
          />
        </div>
        <div className="content">
          <div
            className={`btn-awesome-outline grey reply ${this.context
              .productReview &&
              this.context.productReview.targetReview &&
              this.context.productReview.targetReview.id === _review.id &&
              "active"}`}
            onClick={e => this._handleTargetReview(_review)}
          >
            Reply
          </div>
          <div className="title">
            {_review.Customer.name || _review.Customer.email}
          </div>
          <div className="info">
            <Rating
              precision={0.5}
              value={_review.rate}
              name="rating-reviews"
              icon={<i className="far fa-star"></i>}
              style={{ color: "#737373" }}
              readOnly
            />
            <div>{formatDate(_review.createdAt, 6).format}</div>
          </div>
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: _review.content.replace(/\n/g, "<br/>")
            }}
          />
          {_review.children && _review.children.length !== 0 && (
            <div className="children-container pos-relative">
              {_review.children.map(_children => (
                <div className="children-item" key={`#review-children-item-${_children.id}`}>
                  <div className="children-header">
                    <div className="title">
                      {_children.Customer.name || _children.Customer.email}
                    </div>
                    <div className="info ">
                      <div>{formatDate(_children.createdAt, 6).format}</div>
                    </div>
                  </div>
                  <div
                    className="message"
                    dangerouslySetInnerHTML={{
                      __html: _children.content.replace(/\n/g, "<br/>")
                    }}
                  />

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        {this.state.product && (
          <RcQueueAnim
            className="product-review py-8"
            id={this.state.containerId}
            onScroll={stopPropagationEvent}
            animConfig={[
              { opacity: [1, 0], translateY: [0, 50] },
              { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {this.state.product.ProductReviews.map(_review =>
              this._renderRow(_review)
            )}
          </RcQueueAnim>
        )}
      </>
    );
  }
}

ListProductReview.propTypes = {
  productId: PropTypes.number.isRequired
};
