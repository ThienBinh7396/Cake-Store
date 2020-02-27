import React from 'react'
import { PropTypes } from 'prop-types';
import { Radio, makeStyles } from '@material-ui/core';

function BaseRadioButton(props) {
  const useStyles = makeStyles(theme => ({
    root: {
      "&.Mui-checked, &.Mui-checked ~ .MuiTypography-root": {
        color: props.bcolor,
        transition: '.3s ease'
      }
    }
  }))
  const classes = useStyles() 
  return (
      <Radio {...props} className={classes.root}/>)
}

BaseRadioButton.propTypes = {
  bcolor: PropTypes.string.isRequired
}

export default  BaseRadioButton;