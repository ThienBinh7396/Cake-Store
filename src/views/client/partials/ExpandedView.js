import React from "react";

import PropTypes from "prop-types";

export default class ExpandedView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.expandedRef = React.createRef();
  }

  state = {
    expanded: false,
    contentHeight: 0,
    min: 0
  };

  componentDidMount() {
    const { min, expanded } = this.props;

    this.setState({
      min: min || 0,
      expanded
    });
  }

  _calculateHeight = async () => {
    return new Promise(res => {
      setTimeout(() => {
        const expandedHeight =
          this.expandedRef && this.expandedRef.current
            ? this.expandedRef.current.scrollHeight
            : 0;

        res(this.state.expanded ? expandedHeight : this.state.min);
      }, 10);
    });
  };

  _expandedHeight = async () => {
    let _resultCalculateHeight = await this._calculateHeight();

    if (this.state.contentHeight !== _resultCalculateHeight) {
      this.setState({
        contentHeight: _resultCalculateHeight
      });
    }
  };

  componentDidUpdate() {
    const { expanded } = this.props;

    if (this.state.expanded !== expanded) {
      this.setState({
        expanded
      });
    }

    this._expandedHeight();
  }

  render() {
    return (
      <div
        className="expanded-view clearfix"
        style={{ height: this.state.contentHeight }}
      >
        <div className="expanded-view-content" ref={this.expandedRef}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

ExpandedView.propTypes = {
  min: PropTypes.number,
  expanded: PropTypes.bool
};
