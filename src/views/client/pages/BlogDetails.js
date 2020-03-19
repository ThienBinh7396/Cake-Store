import React from "react";
import BannerHeader from "../partials/BannerHeader";
import { withRouter } from "react-router-dom";
import { Container, Grid, Chip, Box } from "@material-ui/core";
import { ClientContext } from "./../context/ClientProvider";
import RecentBlog from "../partials/RecentBlog";
import { Skeleton } from "@material-ui/lab";
import BlogListWrapper from "./../partials/BlogListWrapper";
import { compareArray } from "../../../utils/helper";
import ListBlogComment from "../partials/ListBlogComment";

class BlogDetails extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    blogTags: null,
    title: null,
    id: -1,
    blog: null,
    blogDetail: null,
    nav: null,
    query: ""
  };

  componentDidMount() {
    const { title } = this.props.match.params;

    const { blogTags, blog } = this.context;

    const nav = [
      { text: "Home", to: "/home", disable: false, className: "" },
      { text: "Blog", to: "/blog", disable: false, className: "" },
      {
        text: decodeURIComponent(title),
        to: "/blog",
        disable: true,
        className: "d-inline-md d-none"
      }
    ];

    this.setState(
      {
        title: decodeURIComponent(title),
        blog,
        blogTags,
        nav
      },
      () => {
        if (blogTags && blogTags.data === null) {
          blogTags.fetchData();
        }
        this.initializeBlogContent();
      }
    );
  }

  initializeBlogContent() {
    const { id } = this.props.match.params;

    console.log(this.props);

    this.setState({
      id: Number(id)
    });

    let _findBlog;

    _findBlog = this.state.blog.data
      ? this.state.blog.data.find(it => it.id === Number(id))
      : null;

    console.log("blog details", "color:red;font-weight:bold");

    console.log(_findBlog);

    if (!_findBlog) {
      setTimeout(() => {
        this.state.blog.addOne(Number(id));
      }, 1000);
    } else {
      this.setState({
        blogDetail: _findBlog
      });
    }
  }

  componentDidUpdate() {
    const { blogTags, blog } = this.context;

    if (
      blogTags.data !== null &&
      this.state.blogTags &&
      (this.state.blogTags.data === null ||
        !compareArray(blogTags.data, this.state.blogTags.data, "id"))
    ) {
      this.setState({
        blogTags: {
          ...blogTags,
          data: blogTags.data
        }
      });
    }

    if (
      blog.data !== null &&
      this.state.blog &&
      (this.state.blog.data === null ||
        !compareArray(blog.data, this.state.blog.data, "id"))
    ) {
      console.log("%cBlog context update", "color:red");
      console.log("%cBlog context update", this.state.blog);

      this.setState(
        {
          blog: {
            ...this.state.blog,
            data: blog.data
          }
        },
        () => {
          this.initializeBlogContent();
        }
      );
    }

    const { id } = this.props.match.params;

    if (Number(id) !== this.state.id) {
      this.setState(
        {
          id: Number(id)
        },
        () => {
          this.initializeBlogContent();
        }
      );
    }

    const _blog = (blog.data || []).find(it => it.data === id);

    if(_blog && this.state.blogDetail && !compareArray(_blog.BlogComments, this.state.blogDetail.BlogComments, 'id')){
      this.setState({
        blogDetail: _blog
      })
    }
  }

  getLeftContent() {
    return (
      <div className="pr-16-md pr-0">
        {!this.state.blogDetail ? (
          <div className="mt-21">
            <Box className="mb-21">
              <Skeleton variant="rect" height="280px" className="mb-4" />
              <Skeleton variant="rect" height="42px" className="mb-4" />
              <Skeleton variant="rect" height="24px" className="mb-6" />
              <Skeleton
                variant="rect"
                height="120px"
                width={`${Math.random() * 40 + 55}%`}
                className="mb-4 transition-fast"
              />
              <Skeleton
                variant="rect"
                height="160px"
                width={`${Math.random() * 10 + 90}%`}
                className="mb-4 transition-fast"
              />
              <Skeleton
                variant="rect"
                height="40px"
                width={`${Math.random() * 75 + 25}%`}
                className="mb-4 transition-fast"
              />
              <Skeleton
                variant="rect"
                height="80px"
                width={`${Math.random() * 25 + 75}%`}
                className="mb-4 transition-fast"
              />
            </Box>
          </div>
        ) : (
          <div className="mt-21">
            <BlogListWrapper
              className="mb-21"
              blog={this.state.blogDetail}
              fullcontent
              withcomment
            />
          </div>
        )}
      </div>
    );
  }

  handleChangeQuery = e => {
    this.setState({ query: e.target.value });
  };

  toQueryBlog = () => {
    this.context.toFilterBlog({ query: this.state.query });
  };

  toTagBlog = tag => {
    this.context.toFilterBlog({ tag });
  };

  _stopPropagation = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  getRightContent() {
    return (
      <div className="widget-sticky-wrapper" onScroll={this._stopPropagation}>
        <div className="widget widget-search">
          <div className="title">Search</div>
          <div className="content">
            <form className="search">
              <input
                type="text"
                placeholder="Type something..."
                value={this.state.query ? this.state.query : ""}
                onChange={this.handleChangeQuery}
              />
              <i
                className="search-icon pe-7s-search"
                onClick={e => this.toQueryBlog()}
              ></i>
            </form>
          </div>
        </div>
        <div className="widget widget-blog-comment">
          <div className="title">
            Comments (
            {this.state.blogDetail
              ? this.state.blogDetail.BlogComments.length
              : 0}
            )
          </div>
          <div className="content pos-relative">
            <div className="pos-relative pb-8">
              {!this.state.blogDetail ||
              this.state.blogDetail.BlogComments.length === 0 ? (
                <div className="no-comment py-24">
                  <img alt="no-comment" src="/img/no-comment.png" width="236" />
                  <div className="title">No comment yet.</div>
                  <div className="sub-title">
                    Be the first to comment on the publication
                  </div>
                </div>
              ) : (
                <ListBlogComment blogId={this.state.blogDetail.id}/>
              )}
            </div>
          </div>
        </div>
        <div className="widget widget-search">
          <div className="title">Recent Blogs</div>
          <div className="content">
            <RecentBlog />
          </div>
        </div>
        <div className="widget widget-tags">
          <div className="title">Tags</div>
          <div className="content">
            <div className="tags">
              {!this.state.blogTags ||
              !this.state.blogTags.data ||
              this.state.blogTags.loading ? (
                Array(4)
                  .fill(null)
                  .map((it, index) => (
                    <Skeleton
                      className="skeleton"
                      variant="rect"
                      height="32px"
                      key={`#-skeleton-tag-${index}`}
                    />
                  ))
              ) : (
                <>
                  {<Chip onClick={e => this.toTagBlog("all")} label={`#All`} />}

                  {this.state.blogTags.data.map(it => (
                    <Chip
                      onClick={e => this.toTagBlog(it.alias)}
                      label={`#${it.title}`}
                      key={`#tag-${it.id}`}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.state.title && (
          <BannerHeader
            background="/img/bg_header_3.jpg"
            color="#29203ccf"
            type="title-with-custom-nav"
            title={this.state.title}
            nav={this.state.nav}
          />
        )}

        <div className="pos-relative widget-wrapper-hightlight container container-4 right hidden-md-down">
          <Container maxWidth="lg" className="pos-relative">
            <Grid container className="flex-column-reverse-xs flex-row-md ">
              <Grid item xs={12} md={7} lg={7}>
                {this.getLeftContent()}
              </Grid>
              <Grid item xs={12} md={5} lg={5} className="widget-wrapper ">
                {this.getRightContent()}
              </Grid>
            </Grid>
          </Container>
        </div>
      </>
    );
  }
}
export default withRouter(BlogDetails);
