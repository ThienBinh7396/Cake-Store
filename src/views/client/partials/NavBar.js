import React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import BaseIcon from "../../../common/component/BaseIcon";
import { Link, NavLink } from "react-router-dom";
import BaseBadge from "./../../../common/component/BaseBadge";
import { CLIENT_NAV } from "./../../../constant/index";
import CartHeader from "./CartHeader";
import { ClientContext } from "./../context/ClientProvider";

class NavBar extends React.PureComponent {
  static contextType = ClientContext;

  constructor(props) {
    super(props);

    this.controlMenuRef = React.createRef();
  }

  state = {
    cart: null,
    scrolltop: null,
    openCart: false
  };

  componentDidMount() {
    const { cart } = this.context;

    const { scrolltop } = this.props;
    this.setState({ scrolltop, cart });
  }

  compareCart = (cart1, cart2) => {
    if (cart1 === null && cart2 === null) {
      return true;
    }

    if (cart1 === null || cart2 === null || cart1.length !== cart2.length) {
      return false;
    }

    let mainArr = cart1.length > cart2.length ? cart1 : cart2;
    let compareArr = cart1.length <= cart2.length ? cart1 : cart2;

    return mainArr.every((it, index) => {
      return (
        it.product.id === compareArr[index].product.id &&
        it.amount === compareArr[index].amount
      );
    });
  };

  componentDidUpdate(prevProps) {
    const { scrolltop } = this.props;

    const { cart } = this.context;

    if (this.state.scrolltop !== scrolltop) {
      this.setState({ scrolltop });
    }

    if (
      cart.data !== null &&
      (this.state.cart.data === null ||
        !this.compareCart(this.state.cart.data, cart.data))
    ) {
      this.setState({
        cart: {
          ...cart,
          data: cart.data
        }
      });
    }
  }

  toggleCart = e => {
    this.setState({
      openCart: !this.state.openCart
    });
  };

  handleClose = e => {
    this.setState({
      openCart: false
    });
  };

  render() {
    return (
      <section className="nav">
        <div
          key="#subNavHeader"
          className={`sub-nav ${
            this.state.scrolltop && this.state.scrolltop > 100 ? "hidden" : ""
          }`}
        >
          <Container maxWidth="lg">
            <Grid container>
              <Grid item sm={6} xs={12}>
                <Box className="left">
                  <BaseIcon
                    icon="fas fa-phone"
                    size={14}
                    margin="0 4px 0 0px"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  Call Us: +84359040781
                </Box>
              </Grid>
              <Grid item sm={6} xs={12}>
                <Box className="right"></Box>
              </Grid>
            </Grid>
          </Container>
        </div>
        <div key="#navHeader" className={`base-navbar`}>
          <Container maxWidth="lg" className="base-navbar-content">
            <Box className="header-logo">
              <Link to="/home">
                Cake<span>Stores</span>
              </Link>
            </Box>
            <div className="header-menu">
              <div className="main-menu">
                <div className="main-menu-content">
                  {CLIENT_NAV.map(it => (
                    <NavLink to={it.path} key={`#nav-${it.text}`}>
                      {it.text}
                    </NavLink>
                  ))}
                </div>
                <div className="main-menu-content">
                  <BaseIcon size={20} icon="fas fa-bars"></BaseIcon>
                </div>
              </div>
              <div className="control-menu" onClick={this.toggleCart}>
                <BaseIcon icon="fas fa-search" size={17} margin="0 24px 0 0" />
                <span ref={this.controlMenuRef}>
                  <BaseBadge
                    badgeContent={this.state.cart && this.state.cart.data ? this.state.cart.data.length : 0}
                    max={9}
                    typecolor="#e47277"
                    className={`cart-header-btn ${
                      this.state.openCart ? "open" : ""
                    }`}
                  >
                    <i className={`pe-7s-cart`} />
                  </BaseBadge>
                </span>
                <CartHeader
                  anchorEl={this.controlMenuRef}
                  handleClose={this.handleClose}
                  open={this.state.openCart}
                />
              </div>
            </div>
          </Container>
        </div>
      </section>
    );
  }
}
export default NavBar;
