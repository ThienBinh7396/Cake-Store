import React, { useContext, useState, useEffect, useRef } from "react";
import BannerHeader from "../partials/BannerHeader";
import { Container, Box, CardMedia} from "@material-ui/core";
import SectionWrapper from "../partials/SectionWrapper";
import { Skeleton } from "@material-ui/lab";
import { ClientContext } from "./../context/ClientProvider";

export default function Home(props) {
  const [products, setProducts] = useState(null);

  const clientContext = useContext(ClientContext);

  useEffect(() => {
    console.log(clientContext.products);
    setProducts(clientContext.products);
  }, [clientContext.products]);

  const NewProductSection = (
    <SectionWrapper title={"New Product"} style={{ minHeight: "280px" }}>
     
    </SectionWrapper>
  );
   /* <Box pt={0.5} width={210}>
          <Skeleton variant="rect" animation="wave" height={118} />
          <Skeleton animation="wave" width="60%" />
          <Skeleton animation="wave" />
        </Box> */
  return (
    <div>
      <BannerHeader carousel></BannerHeader>
      <Container maxWidth="lg">
        <div className="body-content">
          <div className="body-intro">
            <div className="body-intro-content"></div>
          </div>

          {NewProductSection}
        </div>
      </Container>
    </div>
  );
}
