import React, { Component } from "react";
import { PropTypes } from "prop-types";

class AwesomeInput extends Component {
  state = {
    onChange: null
  };

  componentDidMount() {
    this.setState({
      onChange: this.props.onChange
    });
  }

  handleKeyDown(e) {
    if (e.key === "Backspace" || (Number(e.key) >= 0 && Number(e.key) <= 9)) {
    } else {
      e.preventDefault();
    }
  }

  handleControl(up) {
   this.state.onChange(up ? this.props.value + 1 : this.props.value - 1);
  }

  render() {
    return (
      <div className="awesome-input">
        <div
          className="btn btn-despend"
          onClick={e => this.handleControl(false)}
        >
          <i className="fas fa-minus"/>
        </div>
        <input
          value={this.props.value}
          onKeyDown={this.handleKeyDown}
          onChange={e => this.state.onChange(e.target.value)}
        />
        <div className="btn btn-ascend" onClick={e => this.handleControl(true)}>
          <i className="fas fa-plus" />
        </div>
      </div>
    );
  }
}
AwesomeInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired
};

export default AwesomeInput;
