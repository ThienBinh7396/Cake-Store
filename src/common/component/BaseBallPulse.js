import React from "react";
import { PropTypes } from 'prop-types';

function BaseBallPulse(props) {
  const color = props.color || '#3f6ad8';
  
  return (
    <>
      {props.open && (
        <div className={`loader-inner ${props.sync ? 'ball-pulse-sync' : 'ball-pulse'}`}>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
          <div style={{backgroundColor: color}}></div>
        </div>
      )}
    </>
  );
}

BaseBallPulse.propTypes = {
  open: PropTypes.bool.isRequired,
  color: PropTypes.string
}

export default BaseBallPulse;