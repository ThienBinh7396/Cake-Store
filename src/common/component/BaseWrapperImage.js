import React, { useEffect, useRef, useState } from "react";
import { CardMedia, Box } from "@material-ui/core";

import PropTypes from "prop-types";

function BaseWrapperImage(props) {
  const id = useRef(`js-base-image-${Date.now()}`);

  const [height, setHeight] = useState(0.5);
  const [opacity, setOpacity] = useState(0);
  const updateStyles = time => {
    setOpacity(0.6);
    setTimeout(() => {
      setOpacity(1);
    }, 200);

    setTimeout(() => {
      let div = document.getElementById(id.current);

      if (!div) return;
      let style = getComputedStyle(document.getElementById(id.current));
      setHeight(style.height);
    }, time);
  };

  useEffect(() => {
    window.addEventListener("resize", updateStyles(200));
    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, []);


  return (
    <Box
      className="base-wrapper-image"
      {...props}
      style={{ width: props.width, height, opacity }}
    >
      <CardMedia
        id={id.current}
        image={props.image ? props.image : "/img/image-placeholder.webp"}
        component="img"
        onLoad={() => {
          updateStyles(10);
        }}
      />
    </Box>
  );
}

BaseWrapperImage.propTypes = {
  image: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
};

export default BaseWrapperImage;
