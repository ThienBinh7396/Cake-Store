import React from "react";
import * as axiosAction from "./../../../actions/axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class Contact extends React.Component {

  render() {
    return <h1>Admin admin pages</h1>;
  }
}

const mapSateToProps = state => {
  return {
    axios: state.axios.instance
  }
}

const mapDispathToProps = dispatch => {
  return {
    axiosActions: bindActionCreators(axiosAction, dispatch)
  };
};
export default connect(mapSateToProps, mapDispathToProps)(Contact);
