import React from "react";
import { compareArray } from "../../../utils/helper";
import SectionWrapper from "./SectionWrapper";
import { Container, Grid, Box, ButtonBase } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import BlogCard from "./BlogCard";
import { ClientContext } from "../context/ClientProvider";

export default class HomeBlogSection extends React.PureComponent {
  static contextType = ClientContext;

  state = {
    lastestBlogs: null
  };

  componentDidMount() {
    this.setState({
      lastestBlogs: this.context.blog.lastestBlogs
    });
  }
  componentDidUpdate() {
    let { lastestBlogs } = this.context.blog;

    if (
      lastestBlogs.data &&
      (!this.state.lastestBlogs.data ||
        !compareArray(this.state.lastestBlogs.data, lastestBlogs.data, "id"))
    ) {
      this.setState({
        lastestBlogs: {
          ...this.state.lastestBlogs,
          data: lastestBlogs.data
        }
      });
    }
  }

  render() {
    const { lastestBlogs } = this.state;
    return (
      <SectionWrapper
        title={"Blog & News"}
        titleDes={"Out Story"}
        style={{ minHeight: "280px" }}
        background={"#f5f3f0 url(/img/pattern-2.png) "}
      >
        <Container maxWidth="lg">
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              {!lastestBlogs ||
              !lastestBlogs.data ||
              lastestBlogs.data.length === 0 ? (
                <Box p={2} height="100%">
                  <Skeleton
                    variant="rect"
                    animation="wave"
                    height="100%"
                    style={{
                      minHeight: "240px",
                      backgroundColor: "#2f2d2d1c",
                      borderRadius: "8px"
                    }}
                  />
                </Box>
              ) : (
                <Box p={2} height="100%">
                  <BlogCard
                    id={lastestBlogs.data[0].id}
                    type={lastestBlogs.data.length === 3 ? "large" : "normal"}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              {!lastestBlogs || !lastestBlogs.data ? (
                <Box p={2}>
                  <Skeleton
                    variant="rect"
                    animation="wave"
                    height="240px"
                    style={{
                      backgroundColor: "#2f2d2d1c",
                      borderRadius: "8px"
                    }}
                  />
                </Box>
              ) : lastestBlogs.data.length === 1 ? null : (
                <Box p={2}>
                  <BlogCard id={lastestBlogs.data[1].id} />
                </Box>
              )}
              {!lastestBlogs || !lastestBlogs.data ? (
                <Box p={2}>
                  <Skeleton
                    variant="rect"
                    animation="wave"
                    height="240px"
                    style={{
                      backgroundColor: "#2f2d2d1c",
                      borderRadius: "8px"
                    }}
                  />
                </Box>
              ) : lastestBlogs.data.length === 2 ||
                lastestBlogs.data.length === 1 ? null : (
                <Box p={2}>
                  <BlogCard id={lastestBlogs.data[2].id} />
                </Box>
              )}
            </Grid>
          </Grid>

          <ButtonBase
            className="btn-card-wrapper"
            style={{ marginTop: "48px", width: "320px", maxWidth: "72%" }}
          >
            <div className="btn-card">
              Get More
              <i className="fas fa-angle-right"></i>
            </div>
          </ButtonBase>
        </Container>
      </SectionWrapper>
    );
  }
}
