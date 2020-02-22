import React, { createContext } from "react";
import cookie from "./../../../utils/cookie";
import Axios from "axios";

export const ClientContext = createContext();

const axiosInstance = Axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "x-access-token": cookie.getCookie("_tk")
  }
});

class ClientProvider extends React.Component {
  state = {
    dialogReloadPage: {
      open: false,
      update: (_open) => {
        this.setState({
          dialogReloadPage: {
            ...this.state.dialogReloadPage,
            open: _open
          }
        })
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
      data: 0,
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
      connect: async (config) => {
        return new Promise((res, rej) => {
          this.state.axios.data({
            ...config
          })
          .then(rs => {
            let {type} = rs.data;

            if(type === 'TokenInvaild'){
              this.state.dialogReloadPage.update(true);
            }else{
              res(rs);
            }
          })
          .catch(err => {
            rej(err);
          })
        })
      },
      storageToken: token => {
        cookie.setCookie("_tk", token);

        let _axiosInstance = Axios.create({
          baseURL: "http://localhost:5000/api/",
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
    products: {
      data: null,
      loading: false,
      updateData: _products => {
        console.log(_products);
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
            this.state.axios.connect(
              {
                type: "GET",
                url: "client/product/findAll",
              }
            )
              .then(rs => {
                let { data, type, message } = rs.data;

                console.log("test axios");
                console.log(rs);
                if (type === "error") {
                  this.state.toast.show(message, type);
                  this.state.products.updateData({
                    loading: false
                  });
                }

                if (type === "success") {
                  console.log("%c CCCC", "color:red;font-size:22px");
                  console.log(data);
                  this.state.products.updateData({
                    data,
                    loading: false
                  });
                }
              })
              .catch(err => {
                console.log("%c Catch error", "color:purple");
                this.state.toast.show("Fetch product failded!", "error");
              });
          }
        );
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
