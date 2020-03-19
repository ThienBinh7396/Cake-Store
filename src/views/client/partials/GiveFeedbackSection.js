import React from "react";
import { Container, Grid, ButtonBase } from "@material-ui/core";

export default class GiveFeedbackSection extends React.Component {
  state = {
    map: null
  };

  componentDidUpdate() {
    if (this.state.map === null && window.google) {
      let _myLatLng = { lat: 21.038412, lng: 105.780716 };

      let _map = new window.google.maps.Map(document.getElementById("map"), {
        center: _myLatLng,
        zoom: 15
      });

      new window.google.maps.Marker({
        position: _myLatLng,
        map: _map,
        title: "Hello World!",
        draggable: true,
        animation: window.google.maps.Animation.BOUNCE
      });

      console.log("MAP: ", _map);

      this.setState({
        map: _map
      });
    }
  }

  render() {
    return (
      <section className="pos-relative">
        <Container maxWidth="lg">
          <Grid container>
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              className="pos-relative z-index-default"
            >
              <form className="client-feedback-form">
                <div className="client-form-title">Send Feedback</div>
                <div className="client-form-control">
                  <label className="required">Name</label>
                  <div className="client-form-control-wrapper">
                    <input type="text" />
                    <div className="client-form-control-line" />
                  </div>
                </div>
                <div className="client-form-control">
                  <label className="required">Email</label>
                  <div className="client-form-control-wrapper">
                    <input type="text" />
                    <div className="client-form-control-line" />
                  </div>
                </div>
                <div className="client-form-control">
                  <label className="required">Your Message</label>
                  <div className="textarea" contentEditable="" />
                </div>

                <ButtonBase className="btn-card-wrapper">
                  <div
                    className="btn-awesome primary"
                    onClick={e => {
                    }}
                  >
                    Send To Us
                    <i className="fas fa-paper-plane"></i>
                  </div>
                </ButtonBase>
              </form>
            </Grid>
            <div className="google-map-embed">
              <div id="map" />
            </div>
          </Grid>
        </Container>
      </section>
    );
  }
}
