import React, { Component } from "react";

class SectionWrapper extends Component {
  state = {
    title: this.props.title || "Section Title",
    titleDes: this.props.titleDes || "Section Title",
  };
  render() {
    return (
      <section className="section-wrapper" style={{background: this.props.background || null}}>
        <div className="title-des">
          {this.state.titleDes}
        </div>
        <div className="title">{this.state.title}</div>
        {this.props.children}
      </section>
    );
  }
}
export default SectionWrapper;
