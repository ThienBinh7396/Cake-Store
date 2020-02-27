import React from "react";
import { ClientContext } from "./../context/ClientProvider";
import { useEffect, useState, useContext } from "react";
import { Box } from "@material-ui/core";

export default function WrapperSubSection(props) {
  const [products, setProducts] = useState(null);
  const [data, setData] = useState(null);
  const clientContext = useContext(ClientContext);


  useEffect(() => {
    setProducts(clientContext.products);
  }, [clientContext.products]);

  return (
    <Box px={2}>
      <div className="wrapper-sub-section-title">
        {props.title || "Sub Section Title"}
      </div>

      {props.data.loading || !props.data.data
        ? Array(3)
            .fill(null)
            .map((it, index) => (
              <Box
                display="flex"
                mt={2}
                flexDirection="row"
                key={`#${props.title}-${index}`}
              >
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width="30%"
                  height="180px"
                />
                <Box width="70%" pl={2}>
                  <Skeleton animation="wave" width="180px" />
                  <Skeleton animation="wave" width="120px" />
                  <Skeleton animation="wave" />
                  <Box mt={4}>
                    <Skeleton
                      animation="wave"
                      variant="rect"
                      width="220px"
                      height="24px"
                    />
                  </Box>
                  <Box mt={1}>
                    <Skeleton
                      animation="wave"
                      variant="rect"
                      width="180px"
                      height="34px"
                    />
                  </Box>
                </Box>
              </Box>
            ))
        : props.data.data.map(it => (
            <ProductCard
              type="list"
              id={it.id}
              key={`#wrapper-section-${props.title}-${it.id}`}
            />
          ))}
    </Box>
  );
}
