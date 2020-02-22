import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as adminAction from "../../../actions/admin";
import cookie from "../../../utils/cookie";
import Axios from "axios";

export const AdminContext = React.createContext();

const axiosInstance = Axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "x-access-token": cookie.getCookie("_atk")
  }
});
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
    dialogReloadPage: {
      open: false,
      update: _open => {
        this.setState({
          dialogReloadPage: {
            ...this.state.dialogReloadPage,
            open: _open
          }
        });
      }
    },
    axios: {
      data: axiosInstance,
      updateData: () => {
        const _axios = Axios.create({
          baseURL: "http://localhost:5000/api/",
          headers: {
            "x-access-token": cookie.getCookie("_atk")
          }
        });

        this.setState({
          axios: {
            ...this.state.axios,
            data: _axios
          }
        });
      },
      connect: async config => {
        return new Promise((res, rej) => {
          this.state.axios
            .data({
              ...config
            })
            .then(rs => {
              let { type } = rs.data;

              if (type === "TokenInvaild") {
                cookie.setCookie("_atk", null);
                cookie.setCookie("_admin", null);
                this.state.dialogReloadPage.update(true);
              } else {
                res(rs);
              }
            })
            .catch(err => {
              rej(err);
            });
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
          this.state.axios
            .connect({
              method: "GET",
              url: "admin/employees/findAll"
            })
            .then(rs => {
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
        this.state.products.handleChange({
          ...this.state.products,
          data: _data
        });
      },
      remove: _product => {
        this.state.products.handleChange({
          data: this.state.products.data.filter(it => it.id !== _product.id)
        });
      },
      handleChange: _products => {
        let products = {
          ...this.state.products,
          ..._products
        };
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
            this.state.axios
              .connect({
                method: "GET",
                url: "admin/products/findAll"
              })
              .then(rs => {
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
    },
    tags: {
      data: null,
      loading: false,
      updateData: _tags => {
        this.setState({
          tags: {
            ...this.state.tags,
            ..._tags
          }
        });
      },
      controlData: ({ type, tag }) => {
        let tags = [];
        switch (type) {
          case "add":
            tags = [...this.state.tags.data, tag];
            break;
          case "update":
            tags = this.state.tags.data
              ? this.state.tags.data.map(it => (it.id === tag.id ? tag : it))
              : null;
            break;
          case "delete":
            tags = this.state.tags.data
              ? this.state.tags.data.filter(it => it.id !== tag.id)
              : null;
            break;
          default:
            break;
        }
        this.state.tags.updateData({ data: tags });
      },
      fetchData: () => {
        this.setState(
          {
            tags: {
              ...this.state.tags,
              loading: true
            }
          },
          () => {
            console.log("loading: " + this.state.tags.loading);
            this.state.axios
              .connect({
                method: "GET",
                url: "admin/blogTags/findAll"
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  this.state.tags.updateData({ loading: false, data });
                }
                this.state.loadingComponent.updateState(false);
              })
              .catch(err => {
                this.state.tags.updateData({ loading: false });
                console.log("Fetch tags faild...");
              });
          }
        );
      }
    },
    blogs: {
      data: null,
      loading: false,
      handleChange: _blogs => {
        this.setState({
          blogs: {
            ...this.state.blogs,
            ..._blogs
          }
        });
      },
      updateData: ({ type, blog }) => {
        let _blogs;

        switch (type) {
          case "add":
            _blogs = this.state.blogs.data
              ? [...this.state.blogs.data.filter(it => it.id !== blog.id), blog]
              : [blog];

            break;
          case "update":
            _blogs = this.state.blogs.data.map(it =>
              it.id === blog.id ? blog : it
            );
            break;
          case "delete":
            _blogs = this.state.blogs.data.filter(it => it.id !== blog.id);
            break;
          default:
            _blogs = this.state.blogs.data;
            break;
        }

        console.log("%c Update.........", "color:red");
        console.log(_blogs);
        console.log(blog);
        this.state.blogs.handleChange({ data: _blogs });
      },
      fetchData: () => {
        this.setState(
          {
            blogs: {
              ...this.state.blogs,
              loading: true
            }
          },
          () => {
            this.state.axios
              .connect({
                method: "GET",
                url: "admin/blog/findAll"
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  console.log(data);
                  this.state.blogs.handleChange({
                    data,
                    loading: false
                  });
                  this.state.loadingComponent.updateState(false);
                }
              })
              .catch(err => {
                console.log(err);
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

    this.state.axios.updateData();
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
