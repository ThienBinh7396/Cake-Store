import React, { createContext } from "react";

import { withRouter } from "react-router-dom";
import Axios from "axios";
import { BASE_URL } from "../../../constant";
import cookie from "./../../../utils/cookie";
import localStore from "./../../../utils/localStore";

export const ClientContext = createContext();
const axiosInstance = Axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-access-token": cookie.getCookie("_atk")
  }
});

class ClientProvider extends React.Component {
  client = {
    anonymous: localStore.getDataStorage("_anonymous"),
    checkAndUpdateAnonymous: () => {
      if (!this.client.anonymous) {
        let _anonymous = `anonimous_${Date.now()}@demo.com`;
        localStore.setDataStorage("_anonymous", _anonymous);

        this.setState({
          client: {
            ...this.state.client,
            anonymous: _anonymous
          }
        });
      }
    },
    tempEmailInStorage: localStore.getDataStorage("_tempMail"),
    updateTempEmail: _email => {
      localStore.setDataStorage("_tempMail", _email);

      this.setState({
        client: {
          ...this.state.client,
          tempEmailInStorage: _email
        }
      });
    },
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
  };

  categories = {
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
  };

  axios = {
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
  };

  cart = {
    data: null,
    total: 0,
    empty: () => {
      this.state.cart.updateData(
        {
          data: []
        },
        () => {
          this.state.cart.setDataToLocal();
        }
      );
    },
    calculateTotal: () => {
      let _total =
        !this.state.cart.data || this.state.cart.data.lenght === 0
          ? 0
          : this.state.cart.data.reduce((total, current) => {
              let _t =
                total +
                ((Number(`${current.amount}`) *
                  (100 - current.product.discount)) /
                  100) *
                  current.product.price;
              return _t;
            }, 0);

      this.state.cart.updateData({
        total: _total
      });
    },
    remove: ({ product }, callback) => {
      let _cart = this.state.cart.data.filter(
        it => it.product.id !== product.id
      );
      this.state.cart.updateData(
        {
          data: _cart
        },
        () => {
          if (callback) callback();
          this.state.cart.setDataToLocal();
        }
      );
    },
    control: ({ type, product, amount }) => {
      if (!type) {
        type = "add";
      }

      let _index = (this.state.cart.data || []).findIndex(
        it => it.product.id === product.id
      );

      let _cart =
        _index < 0
          ? [...this.state.cart.data, { product, amount }]
          : this.state.cart.data.map(it => {
              return it.product.id === product.id
                ? {
                    ...it,
                    amount:
                      type === "add"
                        ? Number(`${it.amount}`) + Number(`${amount}`)
                        : Number(`${amount}`)
                  }
                : it;
            });

      this.state.cart.updateData(
        {
          data: _cart
        },
        () => {
          this.state.cart.setDataToLocal();
        }
      );
    },
    updateData: (_cart, callback) => {
      this.setState(
        {
          cart: {
            ...this.state.cart,
            ..._cart
          }
        },
        callback
      );
    },
    getDataFromLocal: () => {
      let _cart = localStore.getDataStorage("_cart");
      this.state.cart.updateData({ data: _cart || [] }, () => {
        this.state.cart.calculateTotal();
      });
    },
    setDataToLocal: () => {
      this.state.cart.calculateTotal();
      localStore.setDataStorage("_cart", this.state.cart.data);
    }
  };

  products = {
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
      status: "all",
      category: "all",
      query: "",
      max: 0,
      sort: ["createdAt", "DESC"],
      queueFilter: null,
      updateFilter: ({ page, range, status, query, sort, category }) => {
        this.setState(
          {
            products: {
              ...this.state.products,
              filter: {
                ...this.state.products.filter,
                page: page !== undefined && page !== null ? page : 0,
                range:
                  range !== undefined && range !== null
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
                  sort !== undefined && sort !== null
                    ? sort
                    : this.state.products.filter.sort
              }
            }
          },
          () => {
            console.log("UPDATE...............", this.state.products.filter);
            if (!this.state.products.filter.loading) {
              console.log("UPDATE FILETE", this.state.products.filter);
              this.state.products.filter.fetchData();
            } else {
              this.state.products.filter.updateData({
                queueFilter: true
              });
            }
          }
        );
      },
      updateData: (_filter, callback) => {
        if (_filter.hasOwnProperty("data")) {
          this.state.products.updateData({
            data: [...(this.state.products.data || []), ..._filter.data]
          });
        }

        this.setState(
          {
            products: {
              ...this.state.products,
              filter: {
                ...this.state.products.filter,
                ..._filter
              }
            }
          },
          callback
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
                  this.state.products.filter.updateData(
                    {
                      loading: false,
                      firstLoading: true,
                      data: data.data,
                      max: Number(data.count)
                    },
                    () => {
                      if (this.state.products.filter.queueFilter) {
                        console.log("QUEUE: ", this.state.blog.filter.query);
                        this.state.products.filter.updateFilter({});

                        this.state.products.filter.updateData({
                          queueFilter: null
                        });
                      }
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
  };

  productReview = {
    targetReview: null,
    update: _target => {
      this.setState({
        productReview: {
          ...this.state.productReview,
          targetReview: _target
        }
      });
    },
    updateProductReviewToProduct: (_productId, _productReview) => {
      console.log("Product review: ", _productReview);

      let _newProducts = this.state.products.data.map(it => {
        if (it.id === _productId) {
          if (_productReview.parent_id === 0) {
            it.ProductReviews.splice(0, 0, _productReview);
          } else {
            it.ProductReviews = it.ProductReviews.map(_productReviewItem => {
              if (_productReviewItem.id === _productReview.parent_id) {
                _productReviewItem.children.push(_productReview);
              }

              return _productReviewItem;
            });
          }
        }

        return it;
      });

      this.state.products.updateData({
        data: _newProducts
      });
    }
  };

  feedback = {
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
  };

  blogTags = {
    data: null,
    loading: false,
    updateData: (_blogTags, callback) => {
      if (_blogTags.hasOwnProperty("data")) {
        _blogTags.data = [
          ...(this.state.blogTags.data || []),
          ..._blogTags.data
        ].reduce((arr, current) => {
          return !arr.find(it => it.id === current.id)
            ? [...arr, current]
            : arr;
        }, []);
      }

      this.setState(
        {
          blogTags: {
            ...this.state.blogTags,
            ..._blogTags
          }
        },
        callback
      );
    },
    fetchData: () => {
      this.state.blogTags.updateData(
        {
          loading: true
        },
        () => {
          this.state.axios
            .connect({
              url: "client/blogTags/findAll",
              method: "GET"
            })
            .then(rs => {
              let { data, type } = rs.data;
              if (type === "success") {
                this.state.blogTags.updateData(
                  {
                    data,
                    loading: false
                  },
                  () => {
                    console.log(
                      "%c Component tags",
                      "color:red;font-size:24px"
                    );
                    console.log(this.state.blogTags.data);
                  }
                );
              }
            });
        }
      );
    }
  };

  blog = {
    data: null,
    loading: false,
    addingBlogId: [],
    addOne: id => {
      if (this.state.blog.addingBlogId.findIndex(it => it === id) < 0) {
        this.setState(
          {
            blog: {
              ...this.state.blog,
              addingBlogId: [...this.state.blog.addingBlogId, id]
            }
          },
          () => {
            this.state.axios
              .connect({
                url: "client/blog/findOne",
                method: "GET",
                params: {
                  id
                }
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  this.state.blog.updateData({
                    data: [data]
                  });
                }
              });
          }
        );
      }
    },
    recent: {
      data: null,
      loading: false,
      updateData: (_recent, callback) => {
        if (_recent.hasOwnProperty("data")) {
          this.state.blog.updateData({
            data: _recent.data
          });
        }

        this.setState(
          {
            blog: {
              ...this.state.blog,
              recent: {
                ...this.state.blog.recent,
                ..._recent
              }
            }
          },
          callback
        );
      },
      fetchData: () => {
        this.state.blog.recent.updateData(
          {
            loading: true
          },
          () => {
            this.state.axios
              .connect({
                url: "client/blog/filter",
                method: "GET",
                params: {
                  page: 0,
                  pageLength: 5,
                  query: "",
                  tag: "all"
                }
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  this.state.blog.recent.updateData({
                    data: data.data,
                    loading: false
                  });
                }
              });
          }
        );
      }
    },
    filter: {
      data: null,
      first: false,
      loading: false,
      page: 0,
      pageLength: 5,
      max: 0,
      query: "",
      tag: "all",
      sortBy: ["createdAt", "DESC"],
      queueFilter: null,
      updateData: (_filter, callback) => {
        if (_filter.hasOwnProperty("data")) {
          this.state.blog.updateData({
            data: _filter.data
          });
        }

        this.setState(
          {
            blog: {
              ...this.state.blog,
              filter: {
                ...this.state.blog.filter,
                ..._filter
              }
            }
          },
          callback
        );
      },
      updateFilter: ({ page, pageLength, query, tag, sortBy, max }) => {
        this.state.blog.filter.updateData(
          {
            page:
              page !== undefined && page !== null
                ? page
                : this.state.blog.filter.page,
            pageLength:
              pageLength !== undefined && pageLength !== null
                ? pageLength
                : this.state.blog.filter.pageLength,
            max:
              max !== undefined && max !== null
                ? max
                : this.state.blog.filter.max,
            query:
              query !== undefined && query !== null
                ? query
                : this.state.blog.filter.query,
            tag:
              tag !== undefined && tag !== null
                ? tag
                : this.state.blog.filter.tag,
            sortBy:
              sortBy !== undefined && sortBy !== null
                ? sortBy
                : this.state.blog.filter.sortBy
          },
          () => {
            if (!this.state.blog.filter.loading) {
              this.state.blog.filter.fetchData();
            } else {
              console.log(this.state.blog.filter.query);

              this.state.blog.filter.updateData({ queueFilter: true });
            }
          }
        );
      },
      fetchData: () => {
        this.state.blog.filter.updateData(
          {
            loading: true
          },
          () => {
            this.state.axios
              .connect({
                url: "client/blog/filter",
                method: "GET",
                params: {
                  page: this.state.blog.filter.page,
                  pageLength: this.state.blog.filter.pageLengh,
                  query: this.state.blog.filter.query,
                  tag: this.state.blog.filter.tag
                }
              })
              .then(rs => {
                let { data, type } = rs.data;
                if (type === "success") {
                  this.state.blog.filter.updateData(
                    {
                      data: data.data,
                      first: true,
                      loading: false,
                      max: Number(data.count)
                    },
                    () => {
                      if (this.state.blog.filter.queueFilter) {
                        console.log("QUEUE: ", this.state.blog.filter.query);
                        this.state.blog.filter.updateFilter({});

                        this.state.blog.filter.updateData({
                          queueFilter: null
                        });
                      }
                    }
                  );
                }
              });
          }
        );
      }
    },
    lastestBlogs: {
      data: null,
      loading: false,
      updateData: (_lastestBlog, callback) => {
        if (_lastestBlog.hasOwnProperty("data")) {
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
    addBlogComment: _comment => {
      let _findBlog = this.state.blog.data.find(
        it => it.id === _comment.blog_id
      );

      _findBlog.BlogComments = [_comment, ..._findBlog.BlogComments].reduce(
        (arr, current) => {
          return arr.findIndex(it => it.id === current.id) < 0
            ? [...arr, current]
            : arr;
        },
        []
      );

      console.log("FIND BLOG: ", _findBlog);

      this.state.blog.updateData(
        {
          data: _findBlog
        },
        () => {
          console.log("After Update: ", this.state.blog.data);
        }
      );
    },
    updateData: (_blog, callback) => {
      console.log(
        "DATA>>>>>>>>>>>>>>>>>>>>>>>>>",
        _blog,
        _blog.hasOwnProperty("data")
      );

      if (_blog.hasOwnProperty("data")) {
        _blog.data = [
          ...(this.state.blog.data || []),
          ...(Array.isArray(_blog.data) ? _blog.data : [_blog.data])
        ].reduce((arr, current) => {
          return arr.findIndex(it => it.id === current.id) < 0
            ? [...arr, current]
            : arr;
        }, []);

        console.log("Blog .............");
        console.log(_blog);
      }
      this.setState(
        {
          blog: {
            ...this.state.blog,
            ..._blog
          }
        },
        callback
      );
    }
  };

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
    axios: this.axios,
    client: this.client,
    categories: this.categories,
    toFilterProduct: ({ category, query, status, page }) => {
      console.log("QUERY", query);

      let _uri = "/store?";

      if (query) {
        _uri += `query=${encodeURIComponent(query)}&`;
      }
      if (category) {
        _uri += `category=${encodeURIComponent(category)}&`;
      }
      if (status) {
        _uri += `status=${encodeURIComponent(status)}&`;
      }
      if (page) {
        _uri += `status=${encodeURIComponent(page)}&`;
      }

      this.props.history.push(_uri);
    },
    cart: this.cart,
    products: this.products,
    productReview: this.productReview,
    feedback: this.feedback,
    blogTags: this.blogTags,
    toBlog: ({ title, id }) => {
      this.props.history.push(`/blog/${encodeURIComponent(title)}/${id}`);
    },
    toFilterBlog: ({ tag, query, page }) => {
      console.log("QUERY", query);

      let _uri = "/blog?";

      if (tag) {
        _uri += `tag=${encodeURIComponent(tag)}&`;
      }
      if (page) {
        _uri += `page=${encodeURIComponent(page)}&`;
      }
      if (query) {
        _uri += `query=${encodeURIComponent(query)}&`;
      }

      this.props.history.push(_uri);
    },
    blog: this.blog
  };

  render() {
    return (
      <ClientContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </ClientContext.Provider>
    );
  }
}

export default withRouter(ClientProvider);
