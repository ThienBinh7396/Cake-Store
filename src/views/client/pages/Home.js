import React, { useContext, useState, useEffect } from "react";
import BannerHeader from "../partials/BannerHeader";
import {
  Container,
  Box,
  Grid,
  ButtonBase
} from "@material-ui/core";
import SectionWrapper from "../partials/SectionWrapper";
import { Skeleton } from "@material-ui/lab";
import { ClientContext } from "./../context/ClientProvider";
import BaseCarousel from "../../../common/component/BaseCarousel";
import ProductCard from "./../partials/ProductCard";
import FeedbackCard from "../partials/FeedbackCard";
import BlogCard from "../partials/BlogCard";
import WrapperSubProductSection from './../partials/WrapperSubProductSection';

export default function Home(props) {
  const [products, setProducts] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [blog, setBlog] = useState(null);


  const clientContext = useContext(ClientContext);

  useEffect(() => {
    setProducts(clientContext.products);
  }, [clientContext.products]);

  useEffect(() => {
    setFeedback(clientContext.feedback);
  }, [clientContext.feedback]);

  useEffect(() => {
    setBlog(clientContext.blog);
  }, [clientContext.blog]);


  useEffect(() => {
    console.log("Home did mount")
    return () => {
      console.log("Home un mount")
    };
  }, [])

  const productCarouselBreakpoint = {
    md: {
      itemToShow: 3
    },
    sm: {
      itemToShow: 2
    },
    xs: {
      itemToShow: 1
    }
  };

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

  const NewProductSection = (
    <SectionWrapper
      title={"New Products"}
      titleDes={"Sweet Cakes"}
      style={{ minHeight: "280px" }}
    >
      <BaseCarousel
        className="product-carousel"
        itemToShow={4}
        itemToSlide={4}
        autoplay={true}
        playspeed={7000}
        pagination
        nocontrol
        breakPoints={productCarouselBreakpoint}
        style={{ marginTop: "16px" }}
      >
        {!products ||
        !products.newProducts ||
        products.newProducts.loading ||
        !products.newProducts.data
          ? [1, 2, 3, 4].map((it, index) => (
              <Box
                py={2}
                px={1}
                width={"100%"}
                key={`#skeleton-section-product-${index}`}
              >
                <Skeleton variant="rect" animation="wave" height={282} />
                <Skeleton
                  animation="wave"
                  width="60%"
                  style={{ marginTop: "8px" }}
                />
                <Skeleton variant="rect" animation="wave" height={18} />
              </Box>
            ))
          : products.newProducts.data.map((it, index) => {
              return <ProductCard id={it.id} key={`#product-${it.id}`} />;
            })}
      </BaseCarousel>
    </SectionWrapper>
  );

  const FeedbackSection = (
    <section>
      <div
        className={
          !feedback || feedback.loading || !feedback.data
            ? ""
            : "feedback-section"
        }
        mt={4}
      >
        <BaseCarousel
          nocontrol
          pagination
          playspeed="7000"
          autoplay={false}
          className="base-carousel-feedback"
          
        >
          {!feedback || feedback.loading || !feedback.data
            ? [1, 2].map(it => (
                <div
                  key={`#skeleton-section-product-${it}`}
                  className="skeletonFeedback"
                >
                  <Skeleton variant="rect" animation="wave" height={520} />
                  <Box className="skeletonFeedbackContent">
                    <Skeleton
                      variant="circle"
                      width={102}
                      height={102}
                      animation="wave"
                      className="skeletonFeedbackItem avatar"
                    />
                    <Skeleton
                      animation="wave"
                      width={80}
                      style={{ marginTop: "8px" }}
                      className="skeletonFeedbackItem"
                    />
                    <Skeleton
                      animation="wave"
                      width={260}
                      className="skeletonFeedbackItem title"
                    />
                    <Skeleton
                      variant="rect"
                      animation="wave"
                      height={160}
                      style={{ marginTop: "24px" }}
                      className="skeletonFeedbackItem"
                    />
                  </Box>
                </div>
              ))
            : feedback.data.map(it => (
                <FeedbackCard key={`#feedback-section-${it.id}`} id={it.id} />
              ))}
        </BaseCarousel>
      </div>
    </section>
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
            ) : blog.lastestBlogs.data.length === 2 ? null : (
              <Box p={2}>
                <BlogCard id={blog.lastestBlogs.data[2].id} />
              </Box>
            )}
          </Grid>
        </Grid>

        <ButtonBase className="btn-card-wrapper" style={{marginTop: '48px', width: '320px', maxWidth: '72%'}}>
          <div className="btn-card">
            Get More
            <i className="fas fa-angle-right"></i>
          </div>
        </ButtonBase>
      </Container>
    </SectionWrapper>
  );

  const GiveFeedbackSection = (
    <section>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12} sm={8} md={6}>
            <form className="client-feedback-form">
              <div className="client-form-title">Send Feedback</div>
              <div className="client-form-control">
                <label className="required">Name</label>
                <div className="client-form-control-wrapper">
                  <input type="text" />
                  <div className="client-form-control-line" />
                </div>
              </div>
              <div className="client-form-control">
                <label className="required">Email</label>
                <div className="client-form-control-wrapper">
                  <input type="text" />
                  <div className="client-form-control-line" />
                </div>
              </div>
              <div className="client-form-control">
                <label className="required">Your Message</label>
                <div className="textarea" contentEditable="" />
              </div>

              <ButtonBase className="btn-card-wrapper">
                <div className="btn-card">
                  Send To Us
                  <i className="fas fa-paper-plane"></i>
                </div>
              </ButtonBase>
            </form>
          </Grid>
        </Grid>
      </Container>
    </section>
  );

  return (
    <div>
      <BannerHeader type="carousel"></BannerHeader>
      <Container maxWidth="lg">
        <div className="body-content">
          {BodyIntro}
          {NewProductSection}
        </div>
      </Container>

      {FeedbackSection}
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
      {GiveFeedbackSection}
    </div>
  );
}
