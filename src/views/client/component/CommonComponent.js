import React, { Component } from "react";
import NavBar from "./../partials/NavBar";
import PerfectScrollbar from "@opuscapita/react-perfect-scrollbar";
import { withStyles, Box } from "@material-ui/core";
import { ClientContext } from "./../context/ClientProvider";
import { withSnackbar } from "notistack";
import BaseDialog from "../../../common/component/BaseDialog";

const useStyles = theme => ({
  root: {
    height: "100vh",
    paddingTop: "120px",
    fontFamily: "'Roboto Slab', serif",
    backgroundColor: "#fff"
  }
});

class CommonComponent extends Component {
  static contextType = ClientContext;

  state = {
    toast: null
  };

  handleReize() {
    const { width } = this.context;
    width.updateData(window.innerWidth);
  }

  componentDidMount() {
    
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

    const { products } = this.context;

    if (products.data === null) {
      products.fetchData();
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
    const { scrollTop, dialogReloadPage } = this.context;
    return (
      <PerfectScrollbar
        className={classes.root}
        onScrollY={container => scrollTop.updateData(container.scrollTop)}
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
            Please try refreshing the page or closing and re-opening your browser window.
          </BaseDialog>
          <NavBar />
          <Box pt={1}>{this.props.children}</Box>
        </div>
      </PerfectScrollbar>
    );
  }
}
export default withStyles(useStyles)(withSnackbar(CommonComponent));
