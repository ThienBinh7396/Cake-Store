import React from "react";
import PropTypes from "prop-types";
import LazyImage from "../../../common/component/LazyImage";
import { formatDate, trimText, validateEmail } from "../../../utils/helper";
import { ClientContext } from "./../context/ClientProvider";
import { Chip, TextareaAutosize, CircularProgress } from "@material-ui/core";
import { withSnackbar } from "notistack";
import SnackbarLayout from "./SnackbarLayout";

class BlogListWrapper extends React.PureComponent {
  static propTypes = {
    blog: PropTypes.object.isRequired
  };

  static contextType = ClientContext;

  constructor(props) {
    super(props);
    this._updateTempComment = this._updateTempComment.bind(this);
  }

  state = {
    blog: null,
    tempComment: {
      handling: false,
      email: "",
      content: ""
    }
  };

  componentDidMount() {
    const { client } = this.context;

    this._updateTempComment({
      email: client.data ? client.data.email : client.tempEmailInStorage || ""
    });

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

  _updateTempComment = _temp => {
    this.setState({
      tempComment: {
        ...this.state.tempComment,
        ..._temp
      }
    });
  };

  _handleChangeEmail = e => {
    e.preventDefault();

    this._updateTempComment({
      email: e.target.value
    });
  };

  _handleChangeContent = e => {
    e.preventDefault();

    this._updateTempComment({
      content: e.target.value
    });
  };

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

  _sendComment = e => {
    e.preventDefault();

    const { email, content } = this.state.tempComment;

    const { axios, client, blog } = this.context;

    if (`${email}`.trim().length === 0 || `${content}`.trim().length === 0) {
      this._showToast({
        title: "Reported!",
        icon: true,
        type: "warning",
        content: "Email and content is required!"
      });

      return;
    }

    if (!validateEmail(email)) {
      this._showToast({
        type: "error",
        icon: true,
        title: "Reported",
        content: "Email is invalid!"
      });
      return;
    }

    this._updateTempComment({
      handling: true
    });

    axios
      .connect({
        url: "client/blog/createComment",
        method: "POST",
        data: {
          blogId: this.state.blog.id,
          email,
          content,
          signIn: client.data
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
          blog.addBlogComment(data.data);

          if (
            !client.data &&
            (!client.tempEmailInStorage || client.tempEmailInStorage !== email)
          ) {
            client.updateTempEmail(email);
          }
        }

        this._updateTempComment({
          handling: false
        });
      })
      .catch(err => {
        this._updateTempComment({
          handling: false
        });
      });
  };

  render() {
    return (
      this.state.blog && (
        <div className={this.props.className}>
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
              <button className="btn-awesome primary" onClick={this.toBlog}>
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
              <div className="blog-send-commtent-wrapper">
                <h3 className="mb-4">0 Commments</h3>
                <h3>Give a comment</h3>
                <form>
                  <input
                    value={this.state.tempComment.email}
                    placeholder="Email"
                    className="mb-8"
                    onChange={this._handleChangeEmail}
                  />
                  <TextareaAutosize
                    value={this.state.tempComment.content}
                    placeholder="Comment"
                    className="textarea mb-8"
                    onChange={this._handleChangeContent}
                  />
                  <button
                    className="btn-awesome primary"
                    type="submit"
                    onClick={this._sendComment}
                  >
                    post comment
                    {this.state.tempComment.handling ? (
                      <CircularProgress
                        style={{ margin: "-2px 0 0 8px " }}
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <i
                        className="fas fa-paper-plane"
                        style={{ marginTop: "-2px" }}
                      ></i>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )
    );
  }
}
export default withSnackbar(BlogListWrapper);
