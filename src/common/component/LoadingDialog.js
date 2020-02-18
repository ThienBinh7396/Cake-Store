import { makeStyles, Dialog,  Box, LinearProgress } from "@material-ui/core";
import React from 'react';

const dialogUseStyles = makeStyles(theme => ({
  dialog: {
    "& .MuiPaper-root": {
      backgroundColor: "transparent"
    }
  },
  dialogContent: {
    minWidth: "300px",
    padding: "28px 24px 16px",
    background: "#3f6ad8",
    "& .title": {
      position: "absolute",
      top: "6px",
      left: "24px",
      fontSize: "0.875rem",
      fontWeight: 400,
      color: "#ffffffb3"
    }
  },
  colorPrimary: {
    backgroundColor: '#ffffff',
  },
  barColorPrimary: {
    backgroundColor: '#b3d4fc',
  }
}));

function LoadingDialog(props) {
  const { title, open } = props;
  const classes = dialogUseStyles();

  return (
    <Dialog open={open} className={classes.dialog}>
      <Box className={classes.dialogContent}>
        <Box className="title">{title ? title : "Sumitting..."}</Box>
        <LinearProgress  classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>
      </Box>
    </Dialog>
  );
}

export default LoadingDialog;