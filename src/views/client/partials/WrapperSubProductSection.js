import React from "react";
import { ClientContext } from "../context/ClientProvider";
import { useEffect, useState, useContext, useRef } from "react";
import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import ProductCard from "./ProductCard";
import ComponentWrapperHelper from "../../../common/component/ComponentWrapperHelper";

export default function WrapperSubProductSection(props) {
  const [data, setData] = useState(null);
  const clientContext = useContext(ClientContext);

  const lastestProps = useRef(props);
  useEffect(() => {
    console.log(clientContext.products);
    const field = lastestProps.current.field;
    if (
      clientContext.products &&
      (!data || !data.hasOwnProperty("data") || data.data === null)
    ) {
      setData(clientContext.products[field]);
    }
  }, [clientContext.products, data]);

  return (
    <ComponentWrapperHelper>
      <Box>
        {props.title && (
          <div className="wrapper-sub-section-title">{props.title}</div>
        )}
        {!data || data.loading || !data.data
          ? Array(3)
              .fill(null)
              .map((it, index) => (
                <Box
                  display="flex"
                  mt={2}
                  flexDirection="row"
                  key={`#${props.title}-${index}`}
                >
                  {props.small ? (
                    <Skeleton
                      variant="rect"
                      animation="wave"
                      width="86px"
                      height="86px"
                    />
                  ) : (
                    <Skeleton
                      variant="rect"
                      animation="wave"
                      width="30%"
                      height="180px"
                    />
                  )}
                  {props.small ? (
                    <Box width="70%" pl={2}>
                      <Skeleton animation="wave" width="180px" />
                      <Skeleton animation="wave" width="120px" />
                      <Skeleton animation="wave" />
                    </Box>
                  ) : (
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
                  )}
                </Box>
              ))
          : data.data.map(it => (
              <ProductCard
                type="list"
                small={props.small || false}
                id={it.id}
                norate
                key={`#wrapper-section-${props.title}-${it.id}`}
              />
            ))}
      </Box>
    </ComponentWrapperHelper>
  );
}
