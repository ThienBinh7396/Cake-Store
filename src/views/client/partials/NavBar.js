import React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import BaseIcon from "../../../common/component/BaseIcon";
import { Link, NavLink } from "react-router-dom";
import BaseBadge from "./../../../common/component/BaseBadge";
import { CLIENT_NAV } from "./../../../constant/index";

class NavBar extends React.PureComponent{
  state = {
    scrolltop: null
  }

  componentWillMount(){
    const { scrolltop } = this.props;
    this.setState({scrolltop});
  }
  
  componentDidUpdate(prevProps){
    const {scrolltop} = this.props;
    
    if(this.state.scrolltop !== scrolltop){
      this.setState({scrolltop});
    }
    
  }

  render(){
    return (
      <section className="nav">
        <div
          key="#subNavHeader"
          className={`sub-nav ${this.state.scrolltop && this.state.scrolltop > 100 ? "hidden" : ""}`}
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
              <div className="control-menu">
                <BaseIcon icon="fas fa-search" size={17} margin="0 24px 0 0" />
                <BaseBadge
                  badgeContent={4}
                  max={99}
                  typecolor="#e47277"
                  top={"-3px"}
                  right={"-4px"}
                >
                  <img src="/img/icon-cart.png" alt="c" />
                </BaseBadge>
              </div>
            </div>
          </Container>
        </div>
      </section>
    )

  }
 
}
export default NavBar;
