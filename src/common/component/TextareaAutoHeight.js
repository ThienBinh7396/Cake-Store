import React, { Component } from "react";

import PropTypes from "prop-types";

export default class TextareaAutoHeight extends Component {
  _handleGrowHeight = e => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }

    this.textareaRef.style.height = ``;
    this.textareaRef.style.height = `${this.textareaRef.scrollHeight + 2}px`;
  };

  _stopPropagation = e => {
    e.stopPropagation();
  };

  render() {
    return (
      <textarea
        ref={ref => (this.textareaRef = ref)}
        {...this.props}
        onChange={this._handleGrowHeight}
        onScroll={this._stopPropagation}
      />
    );
  }
}

TextareaAutoHeight.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
