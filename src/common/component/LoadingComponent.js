import React from "react";
import { Dialog, makeStyles, Box } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  loadingComponent: {
    height: "calc(100% - 56px)",
    top: "56px !important",
    width: "calc(100% - 280px)",
    left: "280px !important",
    "& .MuiDialog-container, & .MuiBackdrop-root": {
      height: "calc(100%)",
      top: "0",
      width: "calc(100%)",
      left: "0",
      position: 'absolute',
      background: "transparent",
      cursor: "progress"
    },
    "& .MuiDialog-container": {
      position: "absolute"
    },
    "&.fulldark": {
      height: "100vh",
      top: "0 !important",
      width: "100vw",
      left: "0 !important",

      "& .loader-wrapper": {
        background: "#f6fcff !important"
      }
    },
    "&.dense": {
      height: "calc(100% - 56px)",
      top: "56px !important",
      width: "calc(100% - 72px)",
      left: "72px !important"
    },
   
    "&.dense .MuiDialog-container": {
      position: "absolute"
    },
    "& .MuiDialog-paperScrollPaper": {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%",
      height: "100%",
      margin: 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      background: "transparent",

      "& .loader-wrapper": {
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0.5,
        background: "#F1F4F6"
      },
      "& .loader": {
        position: 'relative',
        display: 'flex',
        textAlign: 'center',
        zIndex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        color: 'rgb(85, 93, 216)',
        fontSize: '16px'
      }
    },
    "& .MuiDialog-paper": {
      boxShadow: "none"
    }
  }
}));

function LoadingComponent({ open, dense, fulldark }) {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      className={`${classes.loadingComponent} ${fulldark ? 'fulldark' : (dense ? "dense" : "")}`}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <div className="loader-wrapper full-size"></div>
      <Box mx="auto" className="loader loader-undefined loader-active" >
        <div className="loader-inner ball-grid-pulse">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Box>
    </Dialog>
  );
}

export default LoadingComponent;
