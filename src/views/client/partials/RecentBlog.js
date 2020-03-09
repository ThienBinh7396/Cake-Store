import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import { compareArray } from "../../../utils/helper";
import { Box, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import BlogListWrapper from "./BlogListWrapper";

export default class RecentBlog extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    recent: null
  };

  componentDidMount() {
    const { blog } = this.context;

    this.setState(
      {
        recent: blog.recent
      },
      () => {
        if (this.state.recent && this.state.recent.data === null) {
          this.state.recent.fetchData();
        }
      }
    );
  }

  componentDidUpdate() {
    const { blog } = this.context;

    const { recent } = this.state;

    if (
      blog.recent.data !== null &&
      recent &&
      (recent.data === null ||
        !compareArray(recent.data, blog.recent.data, "id"))
    ) {
      this.setState({
        recent: {
          ...recent,
          data: blog.recent.data
        }
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.recent && this.state.recent.data ? (
          <>
            {this.state.recent.data.map((it, index) => (
              
              <BlogListWrapper className="mb-8" row small blog={it} key={`#blog-recent-${index}`} />
            ))}
          </>
        ) : (
          <>
            {Array(4)
              .fill(null)
              .map((it, index) => (
                <Grid container className="mb-8" key={`#blog-recent-skeleton-${index}`} >
                  <Grid item xs={4}>
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height="100px"
                      animation="wave"
                    />
                  </Grid>
                  <Grid item xs={8} className="pl-8">
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height="62px"
                      animation="wave"
                    />
                    <Skeleton animation="wave" width="100%" />
                  </Grid>
                </Grid>
              ))}
          </>
        )}
      </div>
    );
  }
}
