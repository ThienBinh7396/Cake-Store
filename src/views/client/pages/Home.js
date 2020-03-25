import React from "react";

import BannerHeader from "../partials/BannerHeader";
import { Container, Grid, Box } from "@material-ui/core";
import CategorySection from "../partials/CategorySection";
import NewProductSection from "../partials/NewProductSection";
import FeedbackSection from "./FeedbackSection";
import GiveFeedbackSection from "../partials/GiveFeedbackSection";
import WrapperSubProductSection from "../partials/WrapperSubProductSection";

import HomeBlogSection from "../partials/HomeBlogSection";


export default class Home1 extends React.PureComponent {
  componentDidMount() {
    document.title = "Cake Stores - Home";

  }


  _renderBodyIntro = () => (
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

  render() {
    console.log("RENDER HOME");

    return (
      <div>
        <BannerHeader type="carousel" />
        <Container maxWidth="lg">
          <div className="body-content">
            {this._renderBodyIntro()}
            <CategorySection />
            <NewProductSection />
          </div>
        </Container>

        <FeedbackSection />
        <Container maxWidth="lg">
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
        </Container>
        <HomeBlogSection />
        <GiveFeedbackSection />
      </div>
    );
  }
}
