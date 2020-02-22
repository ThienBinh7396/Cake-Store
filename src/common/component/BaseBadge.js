import React from "react";
import { Badge, makeStyles } from "@material-ui/core";

import { PropTypes } from 'prop-types';

function BaseBadge(props) {
  const useStyles = makeStyles(theme => ({
    root: {
      "& .MuiBadge-badge": {
        backgroundColor: props.typecolor,
        color: '#fff',
        top: props.top || 0,
        right: props.right || 0
      }
    }
  }));
  const classes = useStyles();
  return <Badge {...props} className={classes.root}></Badge>;
}

BaseBadge.propTypes = {
  typecolor: PropTypes.string.isRequired
}

export default BaseBadge;
