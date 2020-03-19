import React, { useContext, useState, useEffect } from "react";
import BannerHeader from "../partials/BannerHeader";
import { Container, Box, Grid, ButtonBase } from "@material-ui/core";
import SectionWrapper from "../partials/SectionWrapper";
import { Skeleton } from "@material-ui/lab";
import { ClientContext } from "./../context/ClientProvider";
import BlogCard from "../partials/BlogCard";
import WrapperSubProductSection from "./../partials/WrapperSubProductSection";
import CategorySection from "../partials/CategorySection";
import NewProductSection from "../partials/NewProductSection";
import FeedbackSection from "./FeedbackSection";
import GiveFeedbackSection from "../partials/GiveFeedbackSection";

export default function Home(props) {
  const [products, setProducts] = useState(null);
  const [blog, setBlog] = useState(null);

  const clientContext = useContext(ClientContext);

  useEffect(() => {
    document.title = "Cake Stores - Home";
  }, []);

  useEffect(() => {
    setProducts(clientContext.products);
  }, [clientContext.products]);

  useEffect(() => {
    setBlog(clientContext.blog);
  }, [clientContext.blog]);

  useEffect(() => {
    console.log("Home did mount");
    return () => {
      console.log("Home un mount");
    };
  }, []);

  const BodyIntro = (
    <div className="body-intro">
      <Grid container className="body-intro-content" alignItems="center">
        <Grid item md={4} sm={12}>
          <Box display={"flex"} alignItems="start" mt={2} px={2}>
            <div className="image">
              <img alt="iconbox" src="/img/iconbox1.jpg" />
            </div>
            <Box>
              <div className="title">Fresh</div>
              <div className="short-des">Full flavor, all natural.</div>
            </Box>
          </Box>
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display={"flex"} alignItems="start" mt={2} px={2}>
            <div className="image">
              <img alt="iconbox" src="/img/iconbox2.jpg" />
            </div>
            <Box>
              <div className="title">Sweet</div>
              <div className="short-des">Sweets for your every desire</div>
            </Box>
          </Box>
        </Grid>
        <Grid item md={4} sm={12}>
          <Box display={"flex"} alignItems="start" mt={2} px={2}>
            <div className="image">
              <img alt="iconbox" src="/img/iconbox3.jpg" />
            </div>
            <Box>
              <div className="title">Cheap</div>
              <div className="short-des">Full flavor, all natural.</div>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );

  const BlogSection = (
    <SectionWrapper
      title={"Blog & News"}
      titleDes={"Out Story"}
      style={{ minHeight: "280px" }}
      background={"#f5f3f0 url(/img/pattern-2.png) "}
    >
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} sm={12} md={6}>
            {!blog ||
            !blog.lastestBlogs ||
            blog.lastestBlogs.loading ||
            !blog.lastestBlogs.data ||
            blog.lastestBlogs.data.length === 0 ? (
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
                  id={blog.lastestBlogs.data[0].id}
                  type={
                    blog.lastestBlogs.data.length === 3 ? "large" : "normal"
                  }
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            {!blog ||
            !blog.lastestBlogs ||
            blog.lastestBlogs.loading ||
            !blog.lastestBlogs.data ? (
              <Box p={2}>
                <Skeleton
                  variant="rect"
                  animation="wave"
                  height="240px"
                  style={{ backgroundColor: "#2f2d2d1c", borderRadius: "8px" }}
                />
              </Box>
            ) : blog.lastestBlogs.data.length === 1 ? null : (
              <Box p={2}>
                <BlogCard id={blog.lastestBlogs.data[1].id} />
              </Box>
            )}
            {!blog ||
            !blog.lastestBlogs ||
            blog.lastestBlogs.loading ||
            !blog.lastestBlogs.data ? (
              <Box p={2}>
                <Skeleton
                  variant="rect"
                  animation="wave"
                  height="240px"
                  style={{ backgroundColor: "#2f2d2d1c", borderRadius: "8px" }}
                />
              </Box>
            ) : blog.lastestBlogs.data.length === 2 ||
              blog.lastestBlogs.data.length === 1 ? null : (
              <Box p={2}>
                <BlogCard id={blog.lastestBlogs.data[2].id} />
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

  return (
    <div>
      <BannerHeader type="carousel" />
      <Container maxWidth="lg">
        <div className="body-content">
          {BodyIntro}
          <CategorySection />
          <NewProductSection />
        </div>
      </Container>

      <FeedbackSection />
      <Container maxWidth="lg">
        {products ? (
          <Grid container>
            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              style={{ marginTop: "24px", paddingBottom: "42px" }}
            >
              <WrapperSubProductSection
                title="Top Seller"
                key="#wrapper-sub-1"
                field="topSell"
              />
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              style={{ marginTop: "24px", paddingBottom: "42px" }}
            >
              <WrapperSubProductSection
                title="Top Discount"
                field="topDiscounts"
              />
            </Grid>
          </Grid>
        ) : (
          <div></div>
        )}
      </Container>
      {BlogSection}
      <GiveFeedbackSection  />
    </div>
  );
}
