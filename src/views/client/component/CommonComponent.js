import React, { Component } from "react";
import NavBar from "./../partials/NavBar";
import { withStyles, Box } from "@material-ui/core";
import { ClientContext } from "./../context/ClientProvider";
import { withSnackbar } from "notistack";
import BaseDialog from "../../../common/component/BaseDialog";

import _ from "lodash";

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

  constructor(props) {
    super(props);

    this.handleScrollTop = this.handleScrollTop.bind(this);
    this.handleReize = this.handleReize.bind(this);
  }

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
  handleScrollTop() {
    const scrollTop = document.getElementById("main-content").scrollTop;

    const checkPrev = this.state.scrollTop >= 100;
    const checkCurrent = scrollTop >= 100;
    if (checkPrev !== checkCurrent) {
      console.log("Update scroll", scrollTop);
      this.setState({
        scrollTop
      });
    }
  }

  _addPaypalScript = () => {
    let _scriptElement = document.createElement("script");
    _scriptElement.src = "https://www.paypal.com/sdk/js?client-id=sb";

    document.body.appendChild(_scriptElement);
  };

  componentDidMount() {
    // this._addPaypalScript();
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

    window.addEventListener(
      "resize",
      _.debounce(() => {
        this.handleReize();
      }, 200)
    );
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
    const { dialogReloadPage, dialog } = this.context;
    return (
      <div
        className={classes.root}
        id="main-content"
        onScroll={_.debounce(() => {
          this.handleScrollTop();
        }, 100)}
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

          <BaseDialog
            style={{ zIndex: 14 }}
            open={dialog.open}
            maxWidth="xs"
            fullWidth={true}
            title={dialog.data.title}
            type={dialog.data.type}
            onSubmit={dialog.data.onSubmit}
            onClose={() => {
              console.log("close..........", dialog.data.onClose);

              dialog.data.onClose && dialog.data.onClose();
              dialog.show({ open: false });
            }}
          >
            {dialog.data.content}
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
