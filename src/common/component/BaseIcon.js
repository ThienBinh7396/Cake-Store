import React from 'react';

class BaseIcon extends React.Component{
  render(){
    return (
      <i className={`${this.props.icon} ${this.props.className ? this.props.className.toString() : ''}`} style={{ ...this.props.style, color: this.props.color || "#0000008a", fontSize: this.props.size || '14px'}}></i>
    )
  }

}

export default BaseIcon;