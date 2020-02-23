import React, { Component } from "react";
import { PropTypes } from "prop-types";
import Carousel from "../../../common/component/BaseCarousel";
import { ClientContext } from "./../context/ClientProvider";
import { Grid, Box } from "@material-ui/core";

const carousels = [
  {
    image: "http://cakeart.foobla.com/images/2016/04/08/slider2.png",
    title: "Celebration Cake",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "http://cakeart.foobla.com/images/2016/04/08/1.png",
    title: "Strawberry Cupcakes",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "http://cakeart.foobla.com/images/2016/03/23/cake.png",
    title: "Pretty Cake",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "/img/carousel-cake.png",
    title: "Spiced Cider Punch",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    image: "/img/carousel-cake1.png",
    title: "Agave Holiday Ham Glaze",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
];

class BannerHeader extends Component {
  static contextType = ClientContext;

  constructor(props) {
    super(props);
    this.now = btoa(new Date());
  }

  state = {
    background: this.props.background || "/img/bg-slide-1.jpg"
  };

  render() {
    return (
      <div
        className="banner-header"
        style={{ backgroundImage: `url(${this.state.background})`, paddingBottom: "24px" }}
      >
        {this.props.carousel && (
          <Carousel>
            {carousels.map((it, index) => (
              <Grid container alignItems="center" key={index} style={{paddingLeft: '24px', paddingRight: '24px' }}>
                <Grid item  style={{ width: this.context.width.data > 960 ? "46%" : "100%"}}>
                  <img
                    src={it.image}
                    alt={it.title}
                    style={{ maxWidth: "100%", minHeight: "290px" }}
                  />
                </Grid>
                <Grid item style={{ width:  this.context.width.data > 960 ? "54%" : "100%", paddingLeft: '12px'}}>
                  <Box
                    style={{ maxWidth: '520px', margin:  this.context.width.data > 960 ? null: 'auto' , marginTop: '24px' }}
                    align={this.context.width.data > 960 ? "left" : "center"}
                  >
                    <div className="base-carousel-item-title awesome-font">
                      {it.title}
                    </div>
                    <div
                      className="base-carousel-item-description"
                      
                    >
                      {it.description}
                    </div>
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Carousel>
        )}
      </div>
    );
  }
}

BannerHeader.propTypes = {
  carousel: PropTypes.bool.isRequired
};
export default BannerHeader;
