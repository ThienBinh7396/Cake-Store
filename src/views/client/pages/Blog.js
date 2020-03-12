import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import { Container, Grid, Chip, Box, FormControl, Select, MenuItem, Hidden } from "@material-ui/core";
import BannerHeader from "../partials/BannerHeader";
import { compareArray } from "../../../utils/helper";
import { Skeleton, Pagination } from "@material-ui/lab";
import BaseSpinner from "./../../../common/component/BaseSpinner";
import BlogListWrapper from "../partials/BlogListWrapper";
import RecentBlog from "../partials/RecentBlog";
import { withRouter } from "react-router-dom";

class Blog extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    blogTags: null,
    filter: null,
    queryString: null
  };

  componentDidMount() {
    document.title = "Cake Stores - Blogs";

    const { blogTags, blog } = this.context;

    console.log(blog);

    this.setState(
      {
        filter: blog.filter,
        queryString: new URLSearchParams(this.props.location.search)
      },
      () => {
        let tag = this.state.queryString.get("tag");
        let query = this.state.queryString.get("query");

        console.log("%c tag: " + tag, "color:purple");

        if (this.state.filter && !this.state.filter.first) {
          this.state.filter.updateFilter({ tag, query });
        }
      }
    );

    this.setState(
      {
        blogTags
      },
      () => {
        if (blogTags && blogTags.data === null) {
          blogTags.fetchData();
        }
      }
    );
  }

  updateFilterFromContext(field) {
    const { filter } = this.context.blog;

    if (filter && this.state.filter) {
      let obj = {};

      obj[field] = filter[field];

      this.setState({
        filter: {
          ...this.state.filter,
          ...obj
        }
      });
    }
  }

  changePagination = (event, value) => {
    console.log(value);

    this.state.filter.updateFilter({ page: value - 1 });
  };

  componentDidUpdate() {
    const { blogTags, blog } = this.context;

    const { filter } = this.state;

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

    if (filter !== null && blog.filter !== null) {
      Object.keys(filter).forEach(it => {
        if (typeof filter[it] !== "function") {
          if (Array.isArray(filter[it])) {
            let check =
              it === "data"
                ? compareArray(filter[it], blog.filter[it], "id")
                : compareArray(filter[it], blog.filter[it]);
            if (!check) {
              this.updateFilterFromContext(it);
            }
          } else {
            if (filter[it] !== blog.filter[it]) {
              this.updateFilterFromContext(it);
            }
          }
        }
      });
    }
  }

  getStatusBar = () => (
    <>
      <div className="filter-status-bar">
        <div className="filter-status-bar-content filter-status-bar-left">
          <Hidden smDown>
            <div>
              Showing{" "}
              {this.state.filter
                ? this.state.filter.page * this.state.filter.pageLength + 1
                : 0}{" "}
              -{" "}
              {this.state.filter
                ? (this.state.filter.page + 1) * this.state.filter.pageLength >
                  this.state.filter.max
                  ? this.state.filter.max
                  : (this.state.filter.page + 1) * this.state.filter.pageLength
                : 0}{" "}
              of {this.state.filter ? this.state.filter.max : 0} results
            </div>
          </Hidden>
        </div>
        <div className="filter-status-bar-content filter-status-bar-right">
          <div>Sort by: </div>
          <FormControl className="sort-form">
            <Select value={"time"}>
              <MenuItem value={"time"}>Time</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );

  getLeftContent() {
    return (
      <div className="pr-16-md pr-0">
        <Box py={2} pt={0}>
          {this.getStatusBar()}
        </Box>
        {this.state.filter && (
          <>
            <div
              className="loading-filter left"
              style={{
                height:
                  this.state.filter &&
                  this.state.filter.loading &&
                  this.state.filter.first
                    ? "30px"
                    : "0px"
              }}
            >
              <BaseSpinner />
            </div>
            {!this.state.filter.first || !this.state.filter.data ? (
              <div className="mt-21">
                {Array(3)
                  .fill(null)
                  .map((it, index) => (
                    <Box className="mb-21" key={`#-skeleton-blog-${index}`}>
                      <Skeleton
                        variant="rect"
                        height="280px"
                        className="mb-4"
                      />
                      <Skeleton variant="rect" height="42px" className="mb-4" />
                      <Skeleton variant="rect" height="24px" className="mb-4" />
                      <Skeleton variant="rect" height="82px" className="mb-4" />
                    </Box>
                  ))}
              </div>
            ) : (
              <div className="mt-21">
                <div
                  className={`no-results-filter ${
                    this.state.filter.data.length === 0 ? "show" : ""
                  }`}
                >
                  <img src="/img/not-found.jpg" alt="not-found" />
                  <div>Sorry, no result found!</div>
                </div>

                {this.state.filter.data.map(it => (
                  <BlogListWrapper
                    className="mb-21"
                    blog={it}
                    key={`#blog-${it.id}`}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <Box
          display="flex"
          mt={5}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {this.state.filter !== null && (
            <Pagination
              className="product-page-pagination"
              count={
                Math.ceil(
                  this.state.filter.max / this.state.filter.pageLength
                ) <= 0
                  ? 1
                  : Math.ceil(
                      this.state.filter.max / this.state.filter.pageLength
                    )
              }
              page={this.state.filter.page + 1}
              onChange={this.changePagination}
            />
          )}
        </Box>
      </div>
    );
  }

  handleChangeQuery = e => {
    if (this.state.filter) {
      this.state.filter.updateFilter({ query: e.target.value });
    }
  };

  handleUpdateTag = tag => {
    if (this.state.filter) {
      this.state.filter.updateFilter({ tag });
    }
  };

  getRightContent() {
    return (
      <>
        <div className="widget widget-search">
          <div className="title">Search</div>
          <div className="content">
            <form className="search">
              <input
                type="text"
                placeholder="Type something..."
                value={
                  this.state.filter && this.state.filter.query
                    ? this.state.filter.query
                    : ""
                }
                onChange={this.handleChangeQuery}
              />
              <i className="search-icon pe-7s-search"></i>
            </form>
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
                  {
                    <Chip
                      onClick={e => this.handleUpdateTag("all")}
                      className={`${
                        "all" === this.state.filter.tag ? "active" : ""
                      }`}
                      label={`#All`}
                    />
                  }

                  {this.state.blogTags.data.map(it => (
                    <Chip
                      onClick={e => this.handleUpdateTag(it.alias)}
                      className={`${
                        it.alias === this.state.filter.tag ? "active" : ""
                      }`}
                      label={`#${it.title}`}
                      key={`#tag-${it.id}`}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  render() {
    return (
      <>
        <BannerHeader
          background="/img/bg_header_2.jpg"
          color="#29203ccf"
          type="title-with-nav"
          title="Blogs"
        />
        <div className="pos-relative widget-wrapper-hightlight container container-4 right hidden-md-down">
          <Container maxWidth="lg" className="pos-relative">
            <Grid container className="flex-column-reverse-xs flex-row-md ">
              <Grid item xs={12} md={7} lg={8}>
                {this.getLeftContent()}
              </Grid>
              <Grid item xs={12} md={5} lg={4} className="widget-wrapper ">
                {this.getRightContent()}
              </Grid>
            </Grid>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Blog);
