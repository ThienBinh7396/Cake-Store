import React from 'react'

import {ClientContext} from "../context/ClientProvider";
import BannerHeader from '../partials/BannerHeader';

export default class Checkout extends React.PureComponent {
  static contextType = ClientContext;  

  state = {
    nav: null,
    client: null,
    cart: null
  }

  componentDidMount(){
    const nav = [
      { text: "Home", to: "/home", disable: false, className: "" },
      {
        text: "Checkout",
        to: "/checkout",
        disable: true,
        className: ""
      }
    ];

    this.setState({
      nav
    })

    console.log(this.context);

  }

  render() {
    return (
      <>
         <BannerHeader
          background="/img/bg_header_5.jpg"
          color="#29203ccf"
          type="title-with-custom-nav"
          title={"Checkout"}
          nav={this.state.nav}
        /> 
      </>
    )
  }
}
