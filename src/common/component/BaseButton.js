import React from "react";
import { ButtonBase, Box } from "@material-ui/core";

export default function BaseButton(props) {
  const styles = {
    backgroundColor: props.color ? props.color : null,
  };

  if(props.rounded === "false"){
    styles.borderRadius = '0';
  }
  console.log(styles);
  

  return (
    <ButtonBase
      style={{ margin: props.margin ? props.margin : null }}
      {...props}
    >
      <Box
        className={`${props.className && props.className.join(" ")} btn-base`}
        style={{ ...styles, ...props.style }}
      >
        {props.children}
      </Box>
    </ButtonBase>
  );
}
