import React, { Component } from "react";
import PropTypes from "prop-types";
import RcQueueAnim from "rc-queue-anim";
import { formatDate, compareArray } from "../../../utils/helper";
import { MATERIAL_COLOR } from "../../../constant";

import { ClientContext } from "../context/ClientProvider";

export default class ListBlogComment extends Component {
  static contextType = ClientContext;

  state = {
    id: -1,
    blog: null
  };

  componentDidMount() {
    const { blog } = this.context;

    const _blog = blog.data.find(it => it.id === this.props.blogId);

    this.setState({
      id: this.props.blogId,
      blog: _blog
    });
  }

  componentDidUpdate(){


  }

  _renderRow = _comment => {
    return (
      <div
        className="blog-comment-item d-flex"
        key={`#blog-comment-${_comment.id}`}
      >
        <div
          style={{
            backgroundColor:
              MATERIAL_COLOR[parseInt(Math.random() * MATERIAL_COLOR.length)]
          }}
          className={["thumbnail", _comment.Customer.anonymous && "p-2"].join(
            " "
          )}
        >
          <img
            containertarget={`#${this.state.containerId}`}
            width="48px"
            src={_comment.Customer.thumbnail}
            alt={"customer"}
          />
        </div>
        <div className="content">
          <div className="d-flex">
            <div className="blog-title">
              {_comment.Customer.name || _comment.Customer.email}
            </div>
            <div className="info">
              <div>{formatDate(_comment.createdAt, 6).format}</div>
            </div>
          </div>
          <div
            className="message"
            dangerouslySetInnerHTML={{
              __html: _comment.content.replace(/\n/g, "<br/>")
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    return (
      <>
        {this.state.blog && (
          <RcQueueAnim
            animConfig={[
              { opacity: [1, 0], translateY: [0, 50] },
              { opacity: [1, 0], translateY: [0, -50] }
            ]}
          >
            {this.state.blog.BlogComments.map(_comment =>
              this._renderRow(_comment)
            )}
          </RcQueueAnim>
        )}
      </>
    );
  }
}
ListBlogComment.propTypes = {
  blogId: PropTypes.number.isRequired
};
