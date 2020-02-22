import React from 'react';

class BaseIcon extends React.Component{
  render(){
    const style = {
      ...this.props.style,
      fontSize: this.props.size + "px" || '14px',
    }

    if(this.props.color){
      style.color = this.props.color
    }
    if(this.props.margin){
      style.margin = this.props.margin
    }

    return (
      <i className={`${this.props.icon} ${this.props.className ? this.props.className.toString() : ''}`} style={style}></i>
    )
  }

}

export default BaseIcon;