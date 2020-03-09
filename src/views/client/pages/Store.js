import React from "react";

import BannerHeader from "../partials/BannerHeader";

import {
  Grid,
  Slider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Box,
  ButtonBase,
  Select,
  MenuItem,
  Container
} from "@material-ui/core";
import BaseRadioButton from "./../../../common/component/BaseRadioButton";
import { ClientContext } from "./../context/ClientProvider";
import WrapperSubProductSection from "../partials/WrapperSubProductSection";
import Pagination from "@material-ui/lab/Pagination";
import { Skeleton } from "@material-ui/lab";
import ProductCard from "../partials/ProductCard";
import BaseSpinner from "./../../../common/component/BaseSpinner";
import { withRouter } from "react-router-dom";
import { compareArray } from "../../../utils/helper";

class Store extends React.PureComponent {
  static contextType = ClientContext;
  state = {
    filter: null,
    categories: null,
    price: {
      value: [0, 100],
      range: [0, 1000]
    },
    queryString: null
  };

  componentDidMount() {
    const { products, categories } = this.context;

    if (categories) {
      this.setState(
        {
          categories
        },
        () => {
          if (this.state.categories.data === null) {
            this.state.categories.fetchData();
          }
        }
      );
    }

    if (products && products.filter) {
      this.setState(
        {
          filter: products.filter
        },
        () => {
          this.setState(
            {
              queryString: new URLSearchParams(this.props.location.search)
            },
            () => {
              let category = this.state.queryString.get("category");

              console.log("%c category: " + category, "color:purple");

              this.state.filter.updateFilter({ category });
            }
          );
        }
      );
    }
  }

  componentDidUpdate(propPrev) {
    const { products, categories } = this.context;

    const { filter } = this.state;

    if (
      categories.data !== null &&
      this.state.categories &&
      (this.state.categories.data === null ||
        !compareArray(categories.data, this.state.categories.data, "id"))
    ) {
      this.setState({
        categories: {
          ...this.state.categories,
          data: categories.data
        }
      });
    }

    if (
      filter !== null &&
      filter.data === null &&
      products.filter.data !== null
    ) {
      console.log("%c Product update ", "color:red;font-size:30px");
      this.setState(
        {
          filter: {
            ...this.state.filter,
            ...products.filter
          }
        },
        () => {
          console.log("%c Product update ", "color:red;font-size:30px");
          console.log(this.state);
        }
      );
    }

    if (filter !== null && products.filter !== null) {
      Object.keys(filter).forEach(it => {
        if (typeof filter[it] !== "function") {
          if (Array.isArray(filter[it])) {
            let check =
              it === "data"
                ? compareArray(filter[it], products.filter[it], "id")
                : compareArray(filter[it], products.filter[it]);
            if (!check) {
              this.updateFilterFromContext(it);
            }
          } else {
            if (filter[it] !== products.filter[it]) {
              this.updateFilterFromContext(it);
            }
          }
        }
      });
    }
  }

  updateFilterFromContext(field) {
    const { filter } = this.context.products;

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

  handleChangeFilterPrice = (event, _newValue) => {
    this.setState({
      price: {
        ...this.state.price,
        value: _newValue
      }
    });
  };

  startFilterPrice = () => {
    this.state.filter.updateFilter({
      range: this.state.price.value.map(it => parseInt(this.getRealPrice(it)))
    });
  };

  getRealPrice = value => {
    let range = this.state.price.range[1] - this.state.price.range[0];
    return (value * range) / 100;
  };

  valueLabelFormat(value) {
    return `${this.getRealPrice(value)}`;
  }

  handleQueryChange = e => {
    if (this.state.filter) {
      this.state.filter.updateFilter({ query: e.target.value });
    }
  };

  handleChangeStatus = e => {
    this.state.filter.updateFilter({
      status: e.target.value
    });
  };

  handleChangeCategory = e => {
    console.log("Category............");
    console.log(e.target.value);
    this.state.filter.updateFilter({
      category: e.target.value
    });
  };

  getLeftSidebar = () => (
    <>
      <div className="widget widget-search">
        <div className="title">Search</div>
        <div className="content">
          <form className="search">
            <input
              type="text"
              placeholder="Type something..."
              value={this.state.filter ? this.state.filter.query : ""}
              onChange={this.handleQueryChange}
            />
            <i className="search-icon pe-7s-search"></i>
          </form>
        </div>
      </div>
      <div className="widget widget-category">
        <div className="title">Categories</div>
        <div className="content">
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="status"
              name="status"
              value={this.state.filter ? this.state.filter.category : ""}
              onChange={this.handleChangeCategory}
            >
              <FormControlLabel
                label={`All categories(${
                  this.state.categories && this.state.categories.data
                    ? this.state.categories.data.length
                    : 0
                })`}
                value={"all"}
                control={<BaseRadioButton bcolor={"#f6675c"} />}
              ></FormControlLabel>
              {this.state.categories &&
                this.state.categories.data &&
                this.state.categories.data.map(it => (
                  <FormControlLabel
                    key={`#category-${it.id}`}
                    label={it.title}
                    value={it.alias}
                    control={<BaseRadioButton bcolor={"#f6675c"} />}
                  ></FormControlLabel>
                ))}
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="widget widget-search">
        <div className="title">Status</div>
        <div className="content">
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="status"
              name="status"
              value={this.state.filter ? this.state.filter.status : ""}
              onChange={this.handleChangeStatus}
            >
              <FormControlLabel
                label="All"
                value="all"
                control={<BaseRadioButton bcolor={"#f6675c"} />}
              ></FormControlLabel>
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
              step={2}
              value={this.state.price.value}
              color={"secondary"}
              aria-labelledby="vertical-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={this.valueLabelFormat.bind(this)}
              getAriaValueText={this.valueLabelFormat.bind(this)}
              onChange={this.handleChangeFilterPrice.bind(this)}
            />
            <label>
              Price: ${this.getRealPrice(this.state.price.value[0])}- $
              {this.getRealPrice(this.state.price.value[1])}
            </label>
            <br />
            <br />
            <ButtonBase
              className="btn-card-wrapper "
              onClick={this.startFilterPrice}
            >
              <div
                className="btn-card"
                style={{ lineHeight: "20px", fontSize: "11px" }}
              >
                Filter
                <i className="fas fa-filter"></i>
              </div>
            </ButtonBase>
          </div>
        </div>
      </div>
      <div className="widget store-page-top-sell">
        <div className="title">Top Seller</div>
        <WrapperSubProductSection title="" field="topSell" small />
      </div>
    </>
  );
  getStatusBar = () => (
    <>
      <div className="filter-status-bar">
        <div className="filter-status-bar-content filter-status-bar-left">
          <div className="display-style">
            <i className="fas fa-th-large active"></i>
          </div>
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

  getRightSidebar = () => (
    <>
      {
        <div
          className="loading-filter"
          style={{
            height:
              this.state.filter && this.state.filter.loading ? "30px" : "0px"
          }}
        >
          <BaseSpinner />
        </div>
      }
      <Box py={2} pt={0} px={2}>
        {this.getStatusBar()}
      </Box>
      <Grid container>
        {!this.state.filter ||
        !this.state.filter.firstLoading ||
        this.state.filter.data === null ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((it, index) => (
            <Grid
              item
              lg={4}
              md={6}
              sm={12}
              xs={12}
              key={`#skeleton-section-product-${index}`}
            >
              <Box py={2} px={2} width={"100%"}>
                <Skeleton variant="rect" animation="wave" height={282} />
                <Skeleton
                  animation="wave"
                  width="60%"
                  style={{ marginTop: "8px" }}
                />
                <Skeleton variant="rect" animation="wave" height={18} />
              </Box>
            </Grid>
          ))
        ) : (
          <>
            {
              <div
                className={`no-results-filter ${
                  this.state.filter.data.length === 0 ? "show" : ""
                }`}
              >
                <img src="/img/not-found.jpg" alt="not-found" />
                <div>Sorry, no result found!</div>
              </div>
            }
            {this.state.filter.data.map((it, index) => (
              <Grid
                item
                lg={4}
                md={6}
                sm={12}
                xs={12}
                key={`#right-sidebar-product-${it.id}`}
              >
                <Box py={2} width={"100%"}>
                  <ProductCard
                    id={it.id}
                    hightlighttitleregex={
                      this.state.filter.query
                        ? new RegExp(`${this.state.filter.query}`, "ig")
                        : null
                    }
                  />
                </Box>
              </Grid>
            ))}
          </>
        )}
      </Grid>
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
              Math.ceil(this.state.filter.max / this.state.filter.pageLength) <=
              0
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
    </>
  );

  changePagination = (event, value) => {
    console.log(value);

    this.state.filter.updateFilter({ page: value - 1 });
  };

  render() {
    return (
      <div>
        <BannerHeader
          background="/img/bg_header.jpg"
          color="#29203ccf"
          type="title-with-nav"
          title="Stores"
        />
        <div className="pos-relative widget-wrapper-hightlight container container-3">
          <Container>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={3}
                xl={4}
                className="widget-wrapper"
              >
                {this.getLeftSidebar()}
              </Grid>
              <Grid item xs={12} sm={8} md={8} lg={9} xl={8} className="px-4">
                {this.getRightSidebar()}
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(Store);
