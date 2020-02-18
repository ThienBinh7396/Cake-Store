import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { withRouter } from 'react-router-dom';

function Home(props) {
  useEffect(() => {
    document.title = "Admin - Dashboard";
  }, [props.history]);

  console.log('xxx');

  return (<Box component={"h1"}>Home admin pages</Box>);
}

export default withRouter(Home);
