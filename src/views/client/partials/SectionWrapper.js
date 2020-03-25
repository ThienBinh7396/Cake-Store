import React  from "react";

class SectionWrapper extends React.PureComponent {
  state = {
    title: null,
    titleDes: null,
    background: null
  };

  componentDidMount(){
    this.setState({
      title: this.props.title || "Section Title",
      titleDes: this.props.titleDes || "Section Title",
      background: this.props.background || null
    })
  }

  render() {
    return (
      <section
        className="section-wrapper"
        ref={ref => (this.sectionRef = ref)}
        style={{ background: this.state.background || null, ...this.props.style }}
      >
        <div className="title-des">{this.state.titleDes}</div>
        <div className="title">{this.state.title}</div>
        {this.props.children}
      </section>
    );
  }
}
export default SectionWrapper;
