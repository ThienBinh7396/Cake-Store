import Axios from "axios";
import React, { createContext } from "react";

import { BASE_URL } from "../../../constant";
import cookie from "./../../../utils/cookie";

export const ClientContext = createContext();

const axiosInstance = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-access-token": cookie.getCookie("_atk")
  }
});

class ClientProvider extends React.Component {
  state = {
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
    toast: {
      data: {
        show: false,
        type: "default",
        message: ""
      },
      show: (message, type = "default") => {
        this.setState(
          {
            toast: {
              ...this.state.toast,
              data: {
                show: true,
                type,
                message
              }
            }
          },
          () => {
            setTimeout(() => {
              this.setState({
                toast: {
                  ...this.state.toast,
                  data: {
                    ...this.state.toast.data,
                    show: false
                  }
                }
              });
            }, 100);
          }
        );
      }
    },
    width: {
      data: window.width,
      updateData: _width => {
        this.setState({
          width: {
            ...this.state.width,
            data: _width
          }
        });
      }
    },
    scrollTop: {
      data: 0,
      updateData: _scrollTop => {
        this.setState({
          scrollTop: {
            ...this.state.scrollTop,
            data: _scrollTop
          }
        });
      }
    },
    axios: {
      data: axiosInstance,
      updateData: () => {
        const _axios = Axios.create({
          baseURL: BASE_URL,
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
                this.state.dialogReloadPage.update(true);
              } else {
                res(rs);
              }
            })
            .catch(err => {
              rej(err);
            });
        });
      },
      uploadFile: async formData => {
        return new Promise(res => {
          this.state.axios
            .connect({
              url: "https://cakes-store.herokuapp.com/api/uploadFile",
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data"
              },
              data: formData
            })
            .then(rs => {
              const { data } = rs.data;

              res(data);
            })
            .catch(err => {
              res(null);
            });
        });
      },
      storageToken: token => {
        cookie.setCookie("_tk", token);

        let _axiosInstance = Axios.create({
          baseURL: BASE_URL,
          headers: {
            "x-access-token": token
          }
        });

        this.state.axios.updateData({ data: _axiosInstance });
      }
    },
    client: {
      data: cookie.getCookie("_client"),
      updateData: _client => {
        this.setState({
          client: {
            ...this.state.client,
            ..._client
          }
        });
      },
      storageData: client => {
        cookie.setCookie("_client", client);

        this.state.client.updateData({
          data: client
        });
      }
    },
    categories: {
      data: null,
      loading: false,
      updateData: _categories => {
        this.setState({
          categories: {
            ...this.state.categories,
            ..._categories
          }
        });
      },
      fetchData: () => {
        this.setState(
          {
            categories: {
              ...this.state.categories,
              loading: true
            }
          },
          () => {
            console.log("loading: " + this.state.categories.loading);
            this.state.axios
              .connect({
                method: "GET",
                url: "client/category/findAll"
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  this.state.categories.updateData({ loading: false, data });
                }
                this.state.loadingComponent.updateState(false);
              })
              .catch(err => {
                this.state.categories.updateData({ loading: false });
                console.log("Fetch categories faild...");
              });
          }
        );
      }
    },
    products: {
      data: null,
      loading: false,
      addingProductId: [],
      addOne: id => {
        if (
          !this.state.products.data ||
          this.state.products.addingProductId.findIndex(it => it === id) < 0
        ) {
          this.setState(
            {
              products: {
                ...this.state.products,
                addingProductId: [...this.state.products.addingProductId, id]
              }
            },
            () => {
              this.state.axios
                .connect({
                  url: "client/product/findOne",
                  method: "GET",
                  params: {
                    id
                  }
                })
                .then(rs => {
                  const { type, data } = rs.data;

                  if (type === "success") {
                    this.state.products.updateData({
                      data: [...(this.state.products.data || []), data]
                    });
                  }
                });
            }
          );
        }
      },
      newProducts: {
        data: null,
        loading: false,
        fetchData: () => {
          this.setState(
            {
              products: {
                ...this.state.products,
                newProducts: {
                  ...this.state.products.newProducts,
                  loading: true
                }
              }
            },
            () => {
              this.state.axios
                .connect({
                  method: "GET",
                  url: "client/product/newProducts"
                })
                .then(rs => {
                  let { type, data } = rs.data;
                  if (type === "success") {
                    this.state.products.updateData({
                      data: [...(this.state.products.data || []), ...data.data],
                      newProducts: {
                        ...this.state.products.newProducts,
                        data: data.data,
                        loading: false
                      }
                    });
                  }
                });
            }
          );
        }
      },
      topDiscounts: {
        data: null,
        loading: false,
        updateData: (_topDiscounts, callback) => {
          if (_topDiscounts.hasOwnProperty("data")) {
            this.state.products.updateData({
              data: [...(this.state.products.data || []), ..._topDiscounts.data]
            });
          }

          this.setState(
            {
              products: {
                ...this.state.products,
                topDiscounts: {
                  ...this.state.products.topDiscounts,
                  ..._topDiscounts
                }
              }
            },
            callback
          );
        },
        fetchData: () => {
          this.state.products.topDiscounts.updateData(
            {
              loading: true
            },
            () => {
              this.state.axios
                .connect({
                  method: "GET",
                  url: "client/product/topDiscounts"
                })
                .then(rs => {
                  const { data, type } = rs.data;
                  if (type === "success") {
                    this.state.products.topDiscounts.updateData({
                      loading: false,
                      data: data.data
                    });
                  }
                })
                .catch(err => {
                  console.log("Fetch top discount failded!");
                });
            }
          );
        }
      },
      topSell: {
        data: null,
        loading: false,
        fetchData: () => {
          this.setState(
            {
              products: {
                ...this.state.products,
                topSell: {
                  ...this.state.products.topSell,
                  loading: true
                }
              }
            },
            () => {
              this.state.axios
                .connect({
                  method: "GET",
                  url: "client/product/topSell"
                })
                .then(rs => {
                  let { type, data } = rs.data;
                  if (type === "success") {
                    this.state.products.updateData({
                      data: [...(this.state.products.data || []), ...data.data],
                      topSell: {
                        ...this.state.products.topSell,
                        data: data.data,
                        loading: false
                      }
                    });
                  }
                });
            }
          );
        }
      },
      filter: {
        data: null,
        loading: false,
        firstLoading: false,
        page: 0,
        pageLength: 12,
        range: [0, 1000],
        status: null,
        category: "all",
        query: "",
        max: 0,
        sort: ["createdAt", "DESC"],
        updateFilter: ({ page, range, status, query, sort, category }) => {
         
          this.setState(
            {
              products: {
                ...this.state.products,
                filter: {
                  ...this.state.products.filter,
                  page:
                    page !== undefined && page !== null ? page : 0,
                  range:
                    range !== undefined  && range !== null
                      ? range
                      : this.state.products.filter.range,
                  status:
                    status !== undefined && status !== null
                      ? status
                      : this.state.products.filter.status,
                  category:
                    category !== undefined && category !== null
                      ? category
                      : this.state.products.filter.category,
                  query:
                    query !== undefined && query !== null
                      ? query
                      : this.state.products.filter.query,
                  sort:
                    sort !== undefined && sort !== null ? sort : this.state.products.filter.sort
                }
              }
            },
            () => {
              console.log("UPDATE...............", this.state.products.filter);
              if (!this.state.products.filter.loading) {
                console.log("UPDATE FILETE", this.state.products.filter);
                this.state.products.filter.fetchData();
              }
            }
          );
        },
        fetchData: () => {
          this.setState(
            {
              products: {
                ...this.state.products,
                filter: {
                  ...this.state.products.filter,
                  loading: true
                }
              }
            },
            () => {
              console.log("this.state.products.filter");
              console.log(this.state.products.filter);
              this.state.axios
                .connect({
                  type: "GET",
                  url: "client/product/filter",
                  params: {
                    page: this.state.products.filter.page,
                    pageLength: this.state.products.filter.pageLength,
                    range: JSON.stringify(this.state.products.filter.range),
                    status: this.state.products.filter.status,
                    query: this.state.products.filter.query,
                    sort: JSON.stringify(this.state.products.filter.sort),
                    category: this.state.products.filter.category
                  }
                })
                .then(rs => {
                  let { data, type, message } = rs.data;

                  if (type === "success") {
                    this.state.products.updateData({
                      data: [...(this.state.products.data || []), ...data.data]
                    });

                    this.setState(
                      {
                        products: {
                          ...this.state.products,
                          filter: {
                            ...this.state.products.filter,
                            loading: false,
                            firstLoading: true,
                            data: data.data,
                            max: Number(data.count)
                          }
                        }
                      },
                      () => {
                        console.log(this.state.products.filter);
                      }
                    );
                  } else {
                    this.state.toast.show(message, type);
                  }
                });
            }
          );
        }
      },
      updateData: _products => {
        if (_products.hasOwnProperty("data")) {
          console.log("%c UPDATE DATA AAA");
          console.log(_products);

          _products.data = _products.data.reduce((arr, current) => {
            return arr.findIndex(it => it.id === current.id) < 0
              ? [...arr, current]
              : arr;
          }, []);
        }
        this.setState({
          products: {
            ...this.state.products,
            ..._products
          }
        });
      },
      fetchData: () => {
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
                type: "GET",
                url: "client/product/findAll"
              })
              .then(rs => {
                let { data, type, message } = rs.data;

                if (type === "error") {
                  this.state.toast.show(message, type);
                  this.state.products.updateData({
                    loading: false
                  });
                }

                if (type === "success") {
                  this.state.products.updateData({
                    data,
                    loading: false
                  });
                }
              })
              .catch(err => {
                this.state.toast.show("Fetch product failded!", "error");
              });
          }
        );
      }
    },
    feedback: {
      data: null,
      loading: false,
      updateData: _feedback => {
        this.setState({
          feedback: {
            ...this.state.feedback,
            ..._feedback
          }
        });
      },
      fetchData: () => {
        this.setState(
          {
            feedback: {
              ...this.state.feedback,
              loading: true
            }
          },
          () => {
            this.state.axios
              .connect({
                method: "GET",
                url: "client/feedback/show"
              })
              .then(rs => {
                let { data, type } = rs.data;

                if (type === "success") {
                  this.state.feedback.updateData({
                    loading: false,
                    data
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        );
      }
    },
    blog: {
      data: null,
      loading: false,
      lastestBlogs: {
        data: null,
        loading: false,
        updateData: (_lastestBlog, callback) => {
          if (_lastestBlog.hasOwnProperty("data")) {
            console.log([
              ...(this.state.blog.data || []),
              ..._lastestBlog.data
            ]);
            this.state.blog.updateData({
              data: [...(this.state.blog.data || []), ..._lastestBlog.data]
            });
          }

          this.setState(
            {
              blog: {
                ...this.state.blog,
                lastestBlogs: {
                  ...this.state.blog.lastestBlogs,
                  ..._lastestBlog
                }
              }
            },
            callback
          );
        },
        fetchData: () => {
          this.state.blog.lastestBlogs.updateData(
            {
              loading: true
            },
            () => {
              this.state.axios
                .connect({
                  method: "GET",
                  url: "client/blog/lastestBlogs"
                })
                .then(rs => {
                  let { data, type } = rs.data;

                  if (type === "success") {
                    this.state.blog.lastestBlogs.updateData({
                      loading: false,
                      data: data
                    });
                  }
                })
                .catch(err => {
                  console.log("Fetch lastest blog failed!");
                });
            }
          );
        }
      },
      updateData: _blog => {
        if (_blog.hasOwnProperty("data")) {
          _blog.data = _blog.data.reduce((arr, current) => {
            return arr.findIndex(it => it.id === current.id) < 0
              ? [...arr, current]
              : arr;
          }, []);

          console.log("Blog .............");
          console.log(_blog);
        }
        this.setState({
          blog: {
            ...this.state.blog,
            ..._blog
          }
        });
      }
    }
  };

  render() {
    return (
      <ClientContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </ClientContext.Provider>
    );
  }
}

export default ClientProvider;
