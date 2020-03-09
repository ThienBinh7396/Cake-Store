import React from "react";
import PropTypes from "prop-types";
import ComponentWrapperHelper from "../../../common/component/ComponentWrapperHelper";
import LazyImage from "../../../common/component/LazyImage";
import { formatDate, trimText } from "../../../utils/helper";
import { ClientContext } from "./../context/ClientProvider";
import { Chip } from "@material-ui/core";

class BlogListWrapper extends React.PureComponent {
  static propTypes = {
    blog: PropTypes.object.isRequired
  };

  static contextType = ClientContext;

  state = {
    blog: null
  };

  componentDidMount() {
    this.setState({
      blog: this.props.blog
    });
  }

  componentDidUpdate() {
    if (this.props.blog !== null && this.state.blog === null) {
      this.setState({
        blog: this.props.blog
      });
    }
  }

  toBlog = () => {
    if (this.state.blog) {
      this.context.toBlog(this.state.blog);
    }
  };

  render() {
    return (
      this.state.blog && (
        <ComponentWrapperHelper className={this.props.className}>
          <div
            className={`blog-list-wrapper ${this.props.small ? "small" : ""} ${
              this.props.row ? "d-flex flex-row" : ""
            }`}
          >
            {this.props.small ? (
              <div
                className="blog-thumbnail"
                style={{ backgroundImage: `url(${this.state.blog.thumbnail})` }}
                onClick={this.toBlog}
              />
            ) : (
              <div className="blog-thumbnail" onClick={this.toBlog}>
                <LazyImage src={this.state.blog.thumbnail} />
              </div>
            )}
            <div className="blog-header">
              <div className="blog-title" onClick={this.toBlog}>
                <i className="pe-7s-paperclip mr-4"></i>
                {this.state.blog.title}
              </div>
              <div className="blog-meta-small">
                {formatDate(this.state.blog.createdAt, 2).format}
              </div>
              <div className="blog-meta">
                <div className="blog-meta-item">
                  <i className="fas fa-calendar-check" />
                  {formatDate(this.state.blog.createdAt, 2).format}
                </div>
                <div className="blog-meta-item">
                  <i className="fas fa-comment" />
                  {`0 Comments`}
                </div>
                <div className="blog-meta-item">
                  <i className="fas fa-tags" />
                  <span className="tags">
                    {this.state.blog.BlogTags.map(_tag => (
                      <span key={`#tag-${this.state.blog.id}-${_tag.id}`}>
                        {_tag.title}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
            </div>
            {this.props.fullcontent ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: this.state.blog.content }}
              ></div>
            ) : (
              <div className="blog-content">
                {trimText(this.state.blog.content, 320)}
              </div>
            )}
            {!this.props.fullcontent && (
              <button className="btn-awesome primary">
                <span>Read More</span>
                <i className="fas fa-angle-right" />
              </button>
            )}
            {this.props.fullcontent && (
              <div className="blog-information">
                <div className="blog-information-tags">
                  <i className="fas fa-tags mr-4" />
                  <span className="tags">
                    {this.state.blog.BlogTags.map(_tag => (
                      <Chip
                        size="small"
                        key={`#tag-${this.state.blog.id}-${_tag.id}`}
                        label={_tag.title}
                      />
                    ))}
                  </span>
                </div>
                <div className="blog-information-owner">
                  <div
                    className={`thumbnail ${
                      this.state.blog.upload_id !== -1 ? "border" : ""
                    }`}
                  >
                    {this.state.blog.upload_id === -1 ? (
                      <div>ADM</div>
                    ) : (
                      <LazyImage src={this.state.blog.Customer.thumbnail} />
                    )}
                  </div>
                  <div className="info">
                    {this.state.blog.upload_id === -1 ? (
                      <>
                        <div className="title">
                          By <span className="highlight">ADMIN</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="title">
                          By{" "}
                          <span className="highlight">
                            {this.state.blog.Customer.name}
                          </span>
                        </div>
                        <div className="des">
                          {this.state.blog.Customer.email}
                        </div>
                      </>
                    )}
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {this.props.withcomment && (
              <div className="blog-commtent-wrapper">
                <h3 className="mb-4">0 Commments</h3>
                <h3>Give a comment</h3>
                <form>
                  <div className="textarea mb-8" contentEditable/>
                  <button className="btn-awesome primary">post comment</button>
                </form>
              </div>
            )}
          </div>
        </ComponentWrapperHelper>
      )
    );
  }
}
export default BlogListWrapper;
