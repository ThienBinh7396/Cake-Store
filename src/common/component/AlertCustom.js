import React from "react";
import PropTypes from "prop-types";

import TweenOne from "rc-tween-one";

const ICONS = {
  info: <i className="fas fa-info-circle"></i>,
  success: <i className="far fa-check-circle"></i>,
  warning: <i className="fas fa-exclamation-triangle"></i>,
  error: <i className="fas fa-exclamation-circle"></i>
};

export default class AlertCustom extends React.PureComponent {
  constructor(props) {
    super(props);

    this.alertRef = React.createRef(null);
  }

  state = {
    animation: null,
    type: null,
    border: null,
    direction: null,
    icon: null,
    remove: null,
    show: true
  };

  componentDidMount() {
    const { type, border, direction, icon, remove, alignItems } = this.props;

    this.setState({
      type: type !== undefined ? type : "info",
      border: border !== undefined ? border : true,
      direction: direction !== undefined ? direction : "left",
      icon: icon !== undefined ? icon : false,
      remove: remove !== undefined ? remove : true,
      alignItems: alignItems !== undefined ? alignItems : 'center',

    });
  }

  _handleRemove = e => {
    this.setState({
      animation: { height: 0 },
      show: false
    });
  };

  render() {
    const { icon, type, border, direction, remove, alignItems } = this.state;

    return (
      <TweenOne
        className="overflow-hidden"
        animation={this.state.animation}
        yoyo
        moment={0}
        paused={this.state.show}
      >
        <div className="clearfix">
          <div
            className={[
              "alert pos-relative animated slideInUp",
              `${border ? "alert-border" : ""}`,
              `alert-border-${direction}`,
              `alert-${type}`
            ].join(" ")}
            ref={this.alertRef}

            style={{alignItems}}
          >
            {icon && <div className="alert-icon">{ICONS[type]}</div>}
            <div className="alert-content">
              {this.props.children}

            </div>
            {remove && (
              <div
                className="alert-close pos-absolute "
                onClick={this._handleRemove}
              >
                <i className="fas fa-times" />
              </div>
            )}
          </div>
        </div>
      </TweenOne>
    );
  }
}

AlertCustom.propTypes = {
  icon: PropTypes.bool,
  type: PropTypes.string,
  border: PropTypes.bool,
  direction: PropTypes.string,
  remove: PropTypes.bool,
  alignItems: PropTypes.string
};
