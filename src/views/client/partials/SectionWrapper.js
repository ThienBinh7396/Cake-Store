import React, { Component } from "react";

class SectionWrapper extends Component {
  state = {
    title: this.props.title || "Section Title"
  };
  render() {
    return (
      <section className="section-wrapper">
        <div className="title">{this.state.title}</div>
        <div className="title-divider">
          <i className="fas fa-birthday-cake"></i>
        </div>
        {this.props.children}
      </section>
    );
  }
}
export default SectionWrapper;
