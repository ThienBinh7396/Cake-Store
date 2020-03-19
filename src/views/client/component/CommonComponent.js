import React, { Component } from "react";
import NavBar from "./../partials/NavBar";
import { withStyles, Box } from "@material-ui/core";
import { ClientContext } from "./../context/ClientProvider";
import { withSnackbar } from "notistack";
import BaseDialog from "../../../common/component/BaseDialog";

import Footer from "../partials/Footer";

const useStyles = theme => ({
  root: {
    height: "100vh",
    overflowY: "auto",
    paddingTop: "110px",
    fontFamily: "'Libre Baskerville', serif",
    backgroundColor: "#fff",
    scrollBehavior: "smooth"
  }
});

class CommonComponent extends Component {
  static contextType = ClientContext;

  state = {
    toast: null,
    scrollTop: 0
  };

  handleReize() {
    if (this.timerResize) {
      clearTimeout(this.timerResize);
    }

    this.timerResize = setTimeout(
      function() {
        const { width } = this.context;
        width.updateData(window.innerWidth);
      }.bind(this),
      200
    );
  }
  handleScrollTop(e) {
    const event = {
      scrollTop: e.target.scrollTop
    };
    const checkPrev = this.state.scrollTop >= 100;
    const checkCurrent = e.target.scrollTop >= 100;
    if (checkPrev !== checkCurrent) {
      console.log("Update scroll", event.scrollTop);
      this.setState({
        scrollTop: event.scrollTop
      });
    }
  }

  componentDidMount() {
    this.timerScroll = null;
    this.timerResize = null;

    this.showToast = () => {
      if (
        this.state.toast &&
        this.state.toast.show &&
        this.state.toast.message
      ) {
        this.props.enqueueSnackbar(this.state.toast.message, {
          variant: this.state.toast.type
        });
      }
    };

    const { products, feedback, blog, client } = this.context;

    client.checkAndUpdateAnonymous();

    if (products.newProducts.data === null) {
      products.newProducts.fetchData();
    }
    if (products.topSell.data === null) {
      products.topSell.fetchData();
    }
    if (products.topDiscounts.data === null) {
      products.topDiscounts.fetchData();
    }

    if (feedback.data === null) {
      feedback.fetchData();
    }
    if (blog.lastestBlogs.data === null) {
      blog.lastestBlogs.fetchData();
    }

    this.handleReize();

    window.addEventListener("resize", this.handleReize.bind(this));
  }

  componentDidUpdate(prevProps) {
    const { toast } = this.context;

    if (toast.data !== this.state.toast) {
      this.setState(
        {
          toast: toast.data
        },
        () => {
          this.showToast();
        }
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleReize);
  }

  render() {
    const { classes } = this.props;
    const { dialogReloadPage } = this.context;
    return (
      <div
        className={classes.root}
        id="main-content"
        onScroll={this.handleScrollTop.bind(this)}
      >
        <div
          style={{
            minHeight: "100vh"
          }}
        >
          <BaseDialog
            style={{ zIndex: 100 }}
            open={dialogReloadPage.open}
            maxWidth="xs"
            fullWidth={true}
            title="Something went wrong"
            type="text"
            onClose={() => {
              window.location.reload();
              dialogReloadPage.update(false);
            }}
          >
            Please try refreshing the page or closing and re-opening your
            browser window.
          </BaseDialog>
          <NavBar scrolltop={this.state.scrollTop} />
          <Box>{this.props.children}</Box>
          <Footer />
        </div>
      </div>
    );
  }
}
export default withStyles(useStyles)(withSnackbar(CommonComponent));
