import React, { Component } from "react";
import ComponentWrapperHelper from "../../../common/component/ComponentWrapperHelper";

class SectionWrapper extends Component {
  state = {
    title: this.props.title || "Section Title",
    titleDes: this.props.titleDes || "Section Title"
  };

  render() {
    return (
      <ComponentWrapperHelper>
        <section
          className="section-wrapper"
          ref={ref => (this.sectionRef = ref)}
          style={{ background: this.props.background || null }}
        >
          <div className="title-des">{this.state.titleDes}</div>
          <div className="title">{this.state.title}</div>
          {this.props.children}
        </section>
      </ComponentWrapperHelper>
    );
  }
}
export default SectionWrapper;
