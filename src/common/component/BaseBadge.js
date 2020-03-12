import React from "react";

import { PropTypes } from "prop-types";

export default class BaseBadge extends React.Component {
  componentDidMount() {
    this.styles = {
      color: "#fff",
      backgroundColor: this.props.typecolor,
     
    };
  }

  renderWithMax = (num) => {
    let _num = Number(`${num}`);
    if(this.props.max){
      _num = _num > this.props.max ? `${this.props.max}+`: _num; 
    }

    return _num;
  }

  render() {
    return (
      <span className={`badge-root ${this.props.className}`}>
        {this.props.children}
        <span
          className="badge"
          style={{ ...this.styles }}
        >
          {this.renderWithMax(this.props.badgeContent)}
        </span>
      </span>
    );
  }
}

BaseBadge.propTypes = {
  typecolor: PropTypes.string.isRequired
};
