import React from "react";
import BannerHeader from "../partials/BannerHeader";
import {
  Grid,
  Slider,
  FormControl,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import BaseRadioButton from "./../../../common/component/BaseRadioButton";
import { ClientContext } from "./../context/ClientProvider";
import WrapperSubProductSection from "../partials/WrapperSubProductSection";

class Store extends React.Component {
  static contextType = ClientContext;
  state = {
    filter: {
      price: {
        value: [0, 100],
        range: [0, 1000]
      }
    }
  };

  componentDidMount() {
    console.log("Store did mount");
  }

  componentWillUnmount() {
    console.log("Store unmount");
  }

  handleChangeFilterPrice = (event, _newValue) => {
    this.setState({
      filter: {
        price: {
          ...this.state.filter.price,
          value: _newValue
        }
      }
    });
  };

  getRealPrice = value => {
    let range =
      this.state.filter.price.range[1] - this.state.filter.price.range[0];
    return `$${(value * range) / 100} `;
  };

  valueLabelFormat(value) {
    return this.getRealPrice(value);
  }

  render() {
    return (
      <div>
        <BannerHeader
          background="/img/bg_header.jpg"
          color="#29203ccf"
          type="title-with-nav"
          title="Stores"
        />

        <Grid container>
          <Grid item md={5} lg={4} className="widget-wrapper">
            <div className="widget widget-search">
              <div className="title">Search</div>
              <div className="content">
                <form className="search">
                  <input type="text" placeholder="Type something..." />
                  <i className="search-icon pe-7s-search"></i>
                </form>
              </div>
            </div>
            <div className="widget widget-search">
              <div className="title">Status</div>
              <div className="content">
                <FormControl component="fieldset">
                  <RadioGroup aria-label="status" name="status">
                    <FormControlLabel
                      label="Available"
                      value="available"
                      control={<BaseRadioButton bcolor={"#f6675c"} />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="Busy"
                      value="busy"
                      control={<BaseRadioButton bcolor={"#f6675c"} />}
                    ></FormControlLabel>
                    <FormControlLabel
                      label="Unavailable"
                      value="unavailable"
                      control={<BaseRadioButton bcolor={"#f6675c"} />}
                    ></FormControlLabel>
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="widget widget-filter">
              <div className="title">Filter</div>
              <div className="content" pl={6}>
                <div className="filter-wrapper">
                  <Slider
                    orientation="horizontal"
                    step={1}
                    value={this.state.filter.price.value}
                    color={"secondary"}
                    aria-labelledby="vertical-slider"
                    valueLabelDisplay="auto"
                    valueLabelFormat={this.valueLabelFormat.bind(this)}
                    getAriaValueText={this.valueLabelFormat.bind(this)}
                    onChange={this.handleChangeFilterPrice.bind(this)}
                  />
                  <label>
                    Price: {this.getRealPrice(this.state.filter.price.value[0])}
                    -{this.getRealPrice(this.state.filter.price.value[1])}
                  </label>
                </div>
              </div>
            </div>
            <div className="widget">
              <div className="title">Top Seller</div>
              <WrapperSubProductSection title="" field="topSell" small />
            </div>
          </Grid>
          <Grid item md={7} lg={8}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Store;
