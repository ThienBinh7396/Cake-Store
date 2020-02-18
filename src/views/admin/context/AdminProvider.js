import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as adminAction from "../../../actions/admin";
import cookie from "../../../utils/cookie";

export const AdminContext = React.createContext();
class AdminProvider extends Component {
  state = {
    loadingComponent: {
      show: false,
      updateState: show => {
        this.setState({
          loadingComponent: {
            ...this.state.loadingComponent,
            show
          }
        });
      }
    },
    progressDialog: {
      open: false,
      message: "Submitting...",
      updateState: (open, message = "Submitting...") => {
        let _progressDialog = {
          ...this.state.progressDialog,
          open,
          message
        };
        this.setState({
          progressDialog: _progressDialog
        });
      }
    },
    employees: {
      data: null,
      loading: false,
      updateData: value => {
        if (!this.state.employees.data) return;

        let _employees = this.state.employees.data.map(it => {
          return it.id === value.id ? value : it;
        });

        let employees = {
          ...this.state.employees,
          data: _employees
        };

        this.state.employees.handleChange(employees);
      },
      handleChange: _employees => {
        let employees = {
          ...this.state.employees,
          ..._employees
        };
        this.setState({ employees });
      },
      fetchEmployee: () => {
        console.log("fetch employee");

        let employees = {
          ...this.state.employees,
          loading: true
        };
        this.setState({ employees }, () => {
          this.axios.get("admin/employees/findAll").then(rs => {
            let { data, type } = rs.data;

            if (type === "success") {
              this.state.employees.handleChange({
                data: data.filter(it => it.role !== 1),
                loading: false
              });

              this.state.loadingComponent.updateState(false);
            }
          });
        });
      }
    },
    products: {
      data: null,
      loading: false,
      update: _product => {
        let _data = this.state.products.data;

        if (!_data) {
          _data = [];
        }

        let index = _data.findIndex(it => it.id === _product.id);

        _product.gallery = _product.Galleries;

        if (index < 0) {
          _data.push(_product);
        } else {
          _data.splice(index, 1, _product);
        }
        console.log(this.state.products);
        this.state.products.handleChange({...this.state.products, data: _data});
      },
      handleChange: _products => {
        let products = {
          ...this.state.employees,
          ..._products
        }
        this.setState({
          products
        });
      },
      fetchProduct: () => {
        this.setState(
          {
            products: {
              ...this.state.products,
              loading: true
            }
          },
          () => {
            this.axios.get("admin/products/findAll").then(rs => {
              let { data } = rs.data;

              data = data.map(it => {
                return {
                  ...it,
                  gallery: it.Galleries
                };
              });

              this.state.products.handleChange({
                ...this.state.products,
                loading: false,
                data
              });

              this.state.loadingComponent.updateState(false);
            });
          }
        );
      }
    }
  };

  componentDidMount() {
    console.log("Admin provider");
    const { admin, adminActions } = this.props;
    console.log(this.props);

    adminActions.updateAdmin(cookie.getCookie("_admin"));
    adminActions.updateAdminToken(cookie.getCookie("_atk"));
    this.axios = admin.axios;
  }

  render() {
    return (
      <AdminContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </AdminContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  admin: state.admin
});

const mapDispatchToProps = dispatch => ({
  adminActions: bindActionCreators(adminAction, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminProvider);
