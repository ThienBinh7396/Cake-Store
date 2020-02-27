import React, { Component } from "react";
import { Container, Grid } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { CLIENT_NAV } from './../../../constant/index';


export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <Container>
          <Grid container>
            <Grid item md={6} sm={12}>
              <h3>Abount Us</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis.
              </p>
              <table>
                <tbody>
                  <tr>
                    <td>Phone:</td>
                    <td className="footer-note">+84359040781</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td className="footer-note">thienbinh7396@gmail.com</td>
                  </tr>
                </tbody>
              </table>
              <p className="footer-address">
                Cau Giay district, Ha Noi city, Viet Nam
              </p>
            </Grid>
            <Grid item md={3} sm={6} xs={6}>
              <h3>Navigation</h3>
              <ul className="footer-navigation">
                {CLIENT_NAV.map((it, index) => (
                  <li key={`#nav-${index}-${it.text}`}>
                    <NavLink to={it.path}>{it.text}</NavLink>
                    <span></span>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item md={3} sm={6} xs={6}>
              <h3>Connect Us</h3>
              <ul className="footer-contact">
                <li>
                  <i className="fab fa-facebook-f"></i>
                </li>
                <li>
                  <i className="fab fa-google-plus-g"></i>
                </li>
                <li>
                  <i className="fab fa-twitter"></i>
                </li>
                <li>
                  <i className="fab fa-instagram"></i>
                </li>
              </ul>
              <div className="footer-copyright">
                Cake stores <i className="fas fa-heart ld ld-heartbeat" style={{color: 'red'}}></i>{" "}
                {new Date().getFullYear()}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}
