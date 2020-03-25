import React from "react";
import {
  Dialog,
  Slide,
  DialogContent,
  makeStyles,
  Box,
  Divider
} from "@material-ui/core";
import BaseIcon from "./BaseIcon";
import BaseButton from "./BaseButton";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BaseDialog(props) {
  const useStyles = makeStyles(theme => ({
    root: {
      userSelect: "none",
      zIndex: `${props.zIndex || 1301} !important`,
      fontFamily: "Varela Round, sans-serif",
      "& .MuiDialog-paper": {
        padding: 0,
        borderRadius: 0,
        "& .MuiDialogContent-root": {
          padding: 0
        }
      }
    }
  }));
  const classes = useStyles();

  const { title } = props;

  return (
    <Dialog
      className={classes.root}
      {...{ ...props }}
      TransitionComponent={Transition}
    >
      <DialogContent>
        <Box className="base-dialog-header">
          <BaseIcon icon="fas fa-paw" />
          <Box>{title || "Dialog Header"}</Box>
          <Box
            className="base-dialog-close"
            onClick={() => {
              props.onClose();
            }}
          >
            ×
          </Box>
        </Box>
        <Box
          className="base-dialog-body"
          style={{ padding: props.type === "component" ? "0" : null }}
        >
          {props.type === "text" ? (
            <Box className="base-dialog-body-text">
              {props.children ||
                "I am a modal that appears when we click on trigger button."}
            </Box>
          ) : null}
          {props.type === "component" ? <Box>{props.children}</Box> : null}
        </Box>
        <Divider />
        {props.type !== "component" && (
          <Box className="base-dialog-footer">
            {props.onSubmit && (
              <BaseButton
                color="#37c93e"
                margin="0 8px 0 0"
                rounded="false"
                onClick={() => {
                  if (props.onSubmit) {
                    props.onSubmit();
                  }
                }}
              >
                Submit
                <BaseIcon
                  icon="fas fa-check-circle"
                  margin="-2px 0 0 4px"
                ></BaseIcon>
              </BaseButton>
            )}
            <BaseButton
              color="#f72e2e"
              rounded="false"
              onClick={() => {
                props.onClose();
              }}
            >
              Close
              <BaseIcon
                icon="fas fa-times-circle"
                margin="-2px 0 0 4px"
              ></BaseIcon>
            </BaseButton>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
