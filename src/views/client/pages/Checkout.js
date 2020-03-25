import React from "react";

import { ClientContext } from "../context/ClientProvider";
import BannerHeader from "../partials/BannerHeader";
import {
  Container,
  Grid,
  TextareaAutosize,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormHelperText,
  Button
} from "@material-ui/core";
import AlertCustom from "../../../common/component/AlertCustom";
import { withRouter } from "react-router-dom";
import { CITY_IN_VIETNAM, PAYMENT_METHOD } from "../../../constant";
import PaypalButton from "../../../common/component/PaypalButton";
import LoadingComponent from "../../../common/component/LoadingComponent";
import { validateEmail, copyObject } from "../../../utils/helper";

import _ from "lodash";
import SnackbarLayout from "../partials/SnackbarLayout";
import { withSnackbar } from "notistack";

class Checkout extends React.PureComponent {
  static contextType = ClientContext;

  constructor(props) {
    super(props);

    this._getCommuneDistrictByCity = this._getCommuneDistrictByCity.bind(this);
    this._initializeTempAddressDelivery = this._initializeTempAddressDelivery.bind(
      this
    );
    this._mapHandleFromForm = this._mapHandleFromForm.bind(this);
    this._handleChangeTempAddress = this._handleChangeTempAddress.bind(this);
    this._updateValueAddressDelivery = this._updateValueAddressDelivery.bind(
      this
    );

    this._cancelPaypalCheckout = this._cancelPaypalCheckout.bind(this);
    this._successedPaypalCheckout = this._successedPaypalCheckout.bind(this);

    this._postOrder = this._postOrder.bind(this);
    this._checkEmailExists = this._checkEmailExists.bind(this);
  }

  state = {
    nav: null,
    client: null,
    cart: null,
    successedAlert: null,
    billingInfo: {
      successed: false,
      submitting: false,
      username: "",
      phone: "",
      email: "",
      note: "",
      cashStyle: 0 // 0: Cash on delivery // 1: paypal
    },
    email_error: {
      current: 1,
      data: {
        0: {
          type: "success",
          color: "transparent",
          text: "success"
        },
        1: {
          type: "error",
          color: "#FF0000",
          text: "Email field is required!"
        },
        2: {
          type: "warning",
          color: "#ff9800",
          text: "Type of email is invalid!"
        },
        3: {
          type: "warning",
          color: "#ff9800",
          text: "Account was created. You can login to continue!"
        }
      }
    },
    addressDelivery: {
      data: null,
      update: false,
      tempAddress: {
        city: "",
        district: "",
        commune: "",
        address: ""
      },
      communeDistrictByCity: null
    }
  };

  _initializeTempAddressDelivery = () => {
    const { client, axios } = this.context;

    let city = null;

    if (client.data === null && client.addressDelivery === null) {
      city = CITY_IN_VIETNAM.data[0];
    } else {
      if (client.addressDelivery) {
        city = CITY_IN_VIETNAM.data.find(
          it => it.code === client.addressDelivery.city.code
        );

        this._handleChangeAddressDelivery({
          data: client.addressDelivery
        });
        return;
      }
    }

    this._handleChangeTempAddress("city", city, async () => {
      if (this.state.addressDelivery.communeDistrictByCity === null) {
        let resultFromServe = await this._getCommuneDistrictByCity(city.code);

        if (resultFromServe) {
          this._handleChangeAddressDelivery({
            communeDistrictByCity: resultFromServe
          });
        }
      }
    });
  };

  componentDidMount() {
    const nav = [
      { text: "Home", to: "/home", disable: false, className: "" },
      {
        text: "Checkout",
        to: "/checkout",
        disable: true,
        className: ""
      }
    ];
    this._initializeTempAddressDelivery();

    this.setState({
      nav
    });
  }

  _debounceEmail = _.debounce(() => {
    this._validateEmail(true);
  }, 200);

  _mapHandleFromForm = (field, value, callback) => {
    let _newObj = {};

    _newObj[field] = value;

    this.setState(
      {
        billingInfo: {
          ...this.state.billingInfo,
          ..._newObj
        }
      },
      () => {
        callback && callback();
      }
    );
  };

  _getCommuneDistrictByCity = async city_code => {
    return new Promise(res => {
      console.log(city_code);

      this.context.axios
        .connect({
          url: "/getCommuneDistrictFromCity",
          params: {
            city_code
          }
        })
        .then(rs => {
          res(rs.data.data);
        })
        .catch(err => {
          res(null);
        });
    });
  };

  _handleChangeAddressDelivery = (_newAddressDelivery, callback) => {
    console.log("YYY: ", _newAddressDelivery);

    if (
      _newAddressDelivery.hasOwnProperty("update") &&
      _newAddressDelivery["update"]
    ) {
      _newAddressDelivery = {
        ..._newAddressDelivery,
        tempAddress: {
          ...this.state.addressDelivery.data
        }
      };

      this._handleChangeTempAddress(
        "city",
        CITY_IN_VIETNAM.data.find(
          it => it.code === this.state.addressDelivery.data.city.code
        )
      );
    }

    this.setState(
      {
        addressDelivery: {
          ...this.state.addressDelivery,
          ..._newAddressDelivery
        }
      },
      callback
    );
  };

  _updateValueAddressDelivery = () => {
    let { dialog } = this.context;

    let {
      address,
      commune,
      district,
      city
    } = this.state.addressDelivery.tempAddress;

    if (!address) {
      dialog.show({
        open: true,
        title: "Reported!",
        content: (
          <div>
            For <strong style={{ color: "red" }}>convenient delivery</strong>,
            please type your address!
          </div>
        ),
        onClose: () => {
          console.log("this.addressTempRef", this.addressTempRef);

          this.addressTempRef && this.addressTempRef.focus();
        }
      });

      return;
    }

    this._handleChangeAddressDelivery(
      {
        update: false,
        data: {
          address,
          commune,
          district,
          city
        }
      },
      () => {
        this.context.client.updateAddressDelivery({
          address,
          commune,
          district,
          city
        });
      }
    );
  };

  _handleChangeTempAddress = async (field, value, callback) => {
    let _newObj = {};

    _newObj[field] = value;

    switch (field) {
      case "city": {
        this.setState({
          addressDelivery: {
            ...this.state.addressDelivery,
            tempAddress: {
              ...this.state.addressDelivery.tempAddress,
              district: "",
              commune: ""
            }
          }
        });

        let _communeDistrictByCity = await this._getCommuneDistrictByCity(
          value.code
        );

        const { district, commune } = this.state.addressDelivery.data || {};

        let _districtArr = Object.values(
          _communeDistrictByCity["quan-huyen"]
        ).filter(it => it.type === "huyen" || it.type === "quan");

        let _newDistrictValue =
          _districtArr.find(
            it => it.code === (district ? district.code : -1)
          ) || _districtArr[0];
        _newObj["district"] = _newDistrictValue;

        let _communeArr = Object.values(_newDistrictValue["xa-phuong"]).filter(
          it => it.type === "xa" || it.type === "phuong"
        );
        let _newCommuneValue =
          _communeArr.find(it => it.code === (commune ? commune.code : -1)) ||
          _communeArr[0];

        _newObj["commune"] = _newCommuneValue;

        this._handleChangeAddressDelivery({
          communeDistrictByCity: _communeDistrictByCity
        });

        break;
      }

      case "district": {
        let _newCommuneValue = Object.values(value["xa-phuong"]).filter(
          it => it.type === "xa" || it.type === "phuong"
        )[0];
        _newObj["commune"] = _newCommuneValue;

        break;
      }

      default: {
        break;
      }
    }

    this.setState(
      {
        addressDelivery: {
          ...this.state.addressDelivery,
          tempAddress: {
            ...this.state.addressDelivery.tempAddress,
            ..._newObj
          }
        }
      },
      () => {
        if (callback) callback();
      }
    );
  };

  _getListDistrict = () => {
    let _listDistrict = this.state.addressDelivery.communeDistrictByCity
      ? Object.values(
          this.state.addressDelivery.communeDistrictByCity["quan-huyen"]
        ).filter(
          _district => _district.type === "huyen" || _district.type === "quan"
        )
      : [];

    return _listDistrict;
  };

  _getListCommune = () => {
    let _currentDistrict = !(
      this.state.addressDelivery.tempAddress.district &&
      this.state.addressDelivery.communeDistrictByCity
    )
      ? null
      : this.state.addressDelivery.tempAddress.district.code;

    let _communes = [];

    if (_currentDistrict) {
      let _district = this.state.addressDelivery.communeDistrictByCity[
        "quan-huyen"
      ][_currentDistrict];

      if (_district && _district.hasOwnProperty("xa-phuong")) {
        _communes = Object.values(_district["xa-phuong"]).filter(
          it => it.type === "xa" || it.type === "phuong"
        );
      }
    }

    return _communes;
  };

  _handleStopPropagationScrollEvent = () => {
    setTimeout(() => {
      document
        .querySelector("#menu- .MuiPaper-root")
        .addEventListener("scroll", e => {
          document
            .querySelector("#main-content section.nav .sub-nav")
            .classList.add("hidden");
        });
    }, 50);
  };

  _leftContent = () => {
    let _tempAddress = this.state.addressDelivery.data;

    let _addressDelivery = _tempAddress
      ? `Address: ${
          _tempAddress.address.trim().length !== 0
            ? _tempAddress.address + ", "
            : ""
        }${_tempAddress.commune &&
          _tempAddress.commune.name + " commune, "}${_tempAddress.district &&
          _tempAddress.district.name + " district, "}${_tempAddress.city &&
          _tempAddress.city.name + " city, "}`
      : "";

    return (
      <>
        <div className="title">BILLING DETAILS</div>
        <div className="form-checkout-row  required">
          <label className="font-sans-serif">Username</label>
          <input
            value={this.state.billingInfo.username}
            className={[
              "outline-input",
              !this.state.billingInfo.username && "error"
            ].join(" ")}
            onChange={e => this._mapHandleFromForm("username", e.target.value)}
            name="name"
          />
          <div className="error-text">Username field is required!</div>
        </div>
        <div className="form-checkout-row  required">
          <label className="font-sans-serif">Phone</label>
          <input
            value={this.state.billingInfo.phone}
            className={[
              "outline-input",
              !this.state.billingInfo.phone && "error"
            ].join(" ")}
            name="phone"
            onChange={e => this._mapHandleFromForm("phone", e.target.value)}
          />
          <div className="error-text">Phone field is required!</div>
        </div>
        <div className="form-checkout-row  required">
          <label className="font-sans-serif">Email address</label>
          <input
            value={this.state.billingInfo.email}
            className={[
              "outline-input",
              this.state.email_error.current !== 0 && "error"
            ].join(" ")}
            name="email"
            style={{
              borderColor: this.state.email_error.data[
                this.state.email_error.current
              ].color
            }}
            onBlur={e => {
              this._validateEmail(true);
            }}
            onChange={e =>
              this._mapHandleFromForm(
                "email",
                e.target.value,
                this._debounceEmail
              )
            }
          />
          <div
            className="error-text"
            style={{
              color: this.state.email_error.data[this.state.email_error.current]
                .color
            }}
          >
            {this.state.email_error.data[this.state.email_error.current].text}
          </div>
        </div>
        <div
          className={[
            "form-checkout-row required",
            (this.state.addressDelivery.update ||
              !this.state.addressDelivery.data) &&
              "label-start"
          ].join(" ")}
        >
          <label className="font-sans-serif">Address delivery</label>

          <div
            className={[
              "outline-input collapse-address-delivery",
              !this.state.addressDelivery.data && "border"
            ].join(" ")}
          >
            <Collapse
              in={true}
              collapsedHeight={
                this.addressDeliveryRef
                  ? this.addressDeliveryRef.scrollHeight
                  : 0
              }
            >
              <div>
                <div
                  className={[
                    "collapse-content",
                    (this.state.addressDelivery.update ||
                      !this.state.addressDelivery.data) &&
                      "mb-6"
                  ].join(" ")}
                  ref={ref => (this.addressDeliveryRef = ref)}
                >
                  {this.state.addressDelivery.data && (
                    <p>
                      {_addressDelivery}
                      <IconButton
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={e =>
                          this._handleChangeAddressDelivery({
                            update: true
                          })
                        }
                      >
                        <i className="fas fa-pen edit" />
                      </IconButton>
                    </p>
                  )}
                </div>
                <Collapse
                  in={
                    this.state.addressDelivery.update ||
                    !this.state.addressDelivery.data
                  }
                >
                  <div className="collapse-form">
                    <div className=" d-flex">
                      <label>City / Province: </label>
                      <FormControl
                        className={"collapse-form-field select-city"}
                      >
                        <Select
                          value={this.state.addressDelivery.tempAddress.city}
                          onChange={e => {
                            this._handleChangeTempAddress(
                              "city",
                              e.target.value
                            );
                          }}
                          onOpen={this._handleStopPropagationScrollEvent}
                          displayEmpty
                        >
                          <MenuItem value={""} disabled>
                            City / Province
                          </MenuItem>

                          {CITY_IN_VIETNAM.data.map(_city => (
                            <MenuItem
                              key={`#city-in-vietnam-${_city.code}`}
                              value={_city}
                            >
                              {_city.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="d-flex ">
                      <label>District: </label>
                      <FormControl
                        className={"collapse-form-field select-city"}
                      >
                        <Select
                          value={
                            this.state.addressDelivery.tempAddress.district
                          }
                          onChange={e => {
                            this._handleChangeTempAddress(
                              "district",
                              e.target.value
                            );
                          }}
                          onOpen={this._handleStopPropagationScrollEvent}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            District
                          </MenuItem>

                          {this._getListDistrict().map(_district => (
                            <MenuItem
                              key={`#district-${_district.code}`}
                              value={_district}
                            >
                              {_district.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="d-flex">
                      <label>Ward / Commune: </label>
                      <FormControl
                        className={"collapse-form-field select-city"}
                      >
                        <Select
                          value={this.state.addressDelivery.tempAddress.commune}
                          onChange={e => {
                            this._handleChangeTempAddress(
                              "commune",
                              e.target.value
                            );
                          }}
                          onOpen={this._handleStopPropagationScrollEvent}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Ward / Commune
                          </MenuItem>
                          {this._getListCommune().map(_commune => (
                            <MenuItem
                              key={`#commune-${_commune.code}`}
                              value={_commune}
                            >
                              {_commune.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="d-flex label-start">
                      <label className="pb-6">Address: </label>
                      <div className={"collapse-form-field select-city"}>
                        <input
                          className={[
                            "outline-input",
                            !this.state.addressDelivery.tempAddress.address &&
                              "error"
                          ].join(" ")}
                          value={this.state.addressDelivery.tempAddress.address}
                          ref={ref => (this.addressTempRef = ref)}
                          autoFocus
                          onChange={e => {
                            this._handleChangeTempAddress(
                              "address",
                              e.target.value
                            );
                          }}
                        />
                        <FormHelperText>
                          For convenient delivery, please type your address!
                        </FormHelperText>
                      </div>
                    </div>
                    <div
                      className=" d-flex clearfix"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        className="elevation-0 save"
                        onClick={this._updateValueAddressDelivery}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Collapse>
              </div>
            </Collapse>
          </div>
        </div>

        <div className="title">ADDITIONAL INFORMATION</div>
        <div className="form-checkout-row ">
          <label className="font-sans-serif">
            Order notes <span className="highlight">(optional)</span>
          </label>
          <TextareaAutosize
            className={["outline-input"].join(" ")}
            value={this.state.billingInfo.note}
            placeholder="Notes about your order..."
            onChange={e => this._mapHandleFromForm("note", e.target.value)}
          />
        </div>
      </>
    );
  };

  _returnToStore = () => {
    this.props.history.push("/store");
  };

  _checkEmailExists = async email => {
    const { axios } = this.context;

    return new Promise(res => {
      axios
        .connect({
          url: "client/customer/checkExists",
          method: "POST",
          data: {
            email
          }
        })
        .then(rs => {
          let { data } = rs.data;

          if (data && data.anonymous === 0) {
            res(true);
          } else {
            res(false);
          }
        })
        .catch(err => {
          return true;
        });
    });
  };

  _validateEmail = async _updateState => {
    let _email = this.state.billingInfo.email;

    let current = 0;

    if (!validateEmail(_email)) {
      current = 2;
    } else {
      let _checkEmail = await this._checkEmailExists(_email);

      if (_checkEmail) {
        current = 3;
      }
    }

    if (_email.trim().length === 0) {
      current = 1;
    }

    if (_updateState) {
      this.setState({
        email_error: {
          ...this.state.email_error,
          current
        }
      });
    }

    return current;
  };

  _validateOrder = () => {
    let { email, phone, username } = this.state.billingInfo;

    let addressDelivery = this.state.addressDelivery.data;

    if (username.trim() === "" || phone === "" || addressDelivery === null) {
      return 1;
    }

    if (!validateEmail(email)) {
      return 2;
    }

    return 0;
  };

  _cancelPaypalCheckout = () => {
    const { dialog } = this.context;

    dialog.show({
      title: "Warning",
      open: true,
      content: (
        <span>
          You canceled payment in{" "}
          <span className="paypal-logo">
            <span>Pay</span>
            <span>Pal</span>
          </span>
        </span>
      )
    });
  };

  _showToast({ type, title, content, icon }) {
    this.props.enqueueSnackbar(title, {
      variant: "default",
      anchorOrigin: {
        vertical: "top",
        horizontal: "left"
      },
      content: (key, message) => {
        return (
          <SnackbarLayout type={type} icon={icon} id={key} message={message}>
            {content}
          </SnackbarLayout>
        );
      }
    });
  }

  _returnToStore = () => {
    this.props.history.push("/store");
  };

  _postOrder = ({
    payment_info,
    customer,
    note,
    address_delivery,
    cart
  } = {}) => {
    const { axios } = this.context;

    this._mapHandleFromForm("submitting", true);

    axios
      .connect({
        url: "/client/order/create",
        method: "POST",
        data: { payment_info, customer, note, address_delivery, cart }
      })
      .then(rs => {
        this._mapHandleFromForm("submitting", false);

        let { type, data } = rs.data;

        if (type === "success") {
          this.context.cart.empty();

          this._showToast({
            type: "success",
            title: "CONFIRMATION",
            icon: true,
            content: (
              <div>
                <p>Your order was sent to admin.</p>
                <p>
                  Code: <strong>{data.order_code}</strong>
                </p>
                <p>
                  Payment methods:{" "}
                  <strong>
                    {PAYMENT_METHOD[data.payment_info.type].title}
                  </strong>
                </p>
                <p>
                  Total:{" "}
                  <strong style={{ color: "red" }}>
                    ${this.context.cart.total.toFixed(2)}
                  </strong>
                </p>
                <p>
                  An email would be sent to: <strong>{customer.email}</strong>.
                </p>
              </div>
            )
          });

          this._mapHandleFromForm("successed", true);

          this.setState({
            successedAlert: (
              <div className="font-sans-serif alert-successed-payment">
                <p>Your order was sent to admin.</p>
                <p>
                  Code: <strong>{data.order_code}</strong>
                </p>
                <p>
                  Payment methods:{" "}
                  <strong>
                    {PAYMENT_METHOD[data.payment_info.type].title}
                  </strong>
                </p>
                {data.payment_info.type === 1 && (
                  <>
                    <p>
                      PayerID: <strong>{data.payment_info.payerID}</strong>
                    </p>
                    <p>
                      PaymentID: <strong>{data.payment_info.paymentID}</strong>
                    </p>
                  </>
                )}
                <p>
                  Total:{" "}
                  <strong style={{ color: "red" }}>
                    ${this.context.cart.total.toFixed(2)}
                  </strong>
                </p>
                <p>
                  An email would be sent to: <strong>{customer.email}</strong>.
                </p>
                <button
                  className="mt-4 px-8 btn-awesome block width-auto"
                  onClick={this._returnToStore}
                >
                  New Order
                </button>
              </div>
            )
          });
          console.log(data);
        }
        this._mapHandleFromForm("submitting", false);
      })
      .catch(err => {
        this._mapHandleFromForm("submitting", false);
      });
  };

  _successedPaypalCheckout = payment => {
    this._mapHandleFromForm("submitting", true);

    console.log(payment);

    let payment_info = {
      type: 1,
      title: "Payment by paypal",
      payerID: payment.payerID,
      paymentID: payment.paymentID
    };

    const { email, note, username, phone } = this.state.billingInfo;

    const { client } = this.context;

    const address_delivery = this.state.addressDelivery.data;

    let customer = {
      loggin: client.data ? true : false,
      email,
      phone,
      name: username
    };

    let cart = this.context.cart.data.map(_cart => {
      return {
        product_detail: copyObject(_cart.product, [
          "id",
          "title",
          "discount",
          "price",
          "thumbnail"
        ]),
        product_id: _cart.product.id,
        current_price: (100 - _cart.product.discount) / 100 * _cart.product.price,
        amount: _cart.amount
      };
    });

    this._postOrder({
      payment_info,
      customer,
      note,
      address_delivery,
      cart
    });
  };

  _checkout = e => {
    e.preventDefault();

    let { dialog, client } = this.context;

    let _resultValidate = this._validateOrder();

    let _errorStatus = {
      1: (
        <span>
          Please type <strong style={{ color: "red" }}>required</strong> field.
        </span>
      ),
      2: (
        <span>
          Email type is <strong style={{ color: "red" }}>invalid</strong>.
        </span>
      )
    };

    if (_resultValidate !== 0) {
      dialog.show({
        title: "Warning",
        open: true,
        content: _errorStatus[_resultValidate]
      });

      return;
    }

    // Submit order with cashStyle: Cash on delivery

    this._mapHandleFromForm("submitting", true);

    let payment_info = {
      type: 0,
      title: "Cash on delivery"
    };

    const { email, note, username, phone } = this.state.billingInfo;

    const address_delivery = this.state.addressDelivery.data;

    let customer = {
      loggin: client.data ? true : false,
      email,
      phone,
      name: username
    };

    let cart = this.context.cart.data.map(_cart => {
      return {
        product_detail: copyObject(_cart.product, [
          "id",
          "title",
          "discount",
          "price",
          "thumbnail"
        ]),
        product_id: _cart.product.id,
        current_price: (100 - _cart.product.discount) / 100 * _cart.product.price,
        amount: _cart.amount
      };
    });

    this._postOrder({
      payment_info,
      customer,
      note,
      address_delivery,
      cart
    });
  };

  _rightContent = () => {
    const { cashStyle } = this.state.billingInfo;

    return (
      <div className="client-summary-wrapper">
        <div className="client-summary-title">Cart Sumary</div>
        <div className="client-summary-content">
          <div className="row">
            <label className="bold">Products: </label>
            <label className="bold">Total</label>
          </div>
          {!this.context.cart ||
          !this.context.cart.data ||
          this.context.cart.data.length === 0 ? (
            <div className="row">
              <div className="d-flex">
                <span>Your cart is empty</span>
                <button
                  className="ml-4 btn-awesome-outline primary text-uppercase xs-size"
                  onClick={this._returnToStore}
                  style={{ marginTop: "-2px" }}
                >
                  Return to store
                </button>
              </div>
            </div>
          ) : (
            this.context.cart.data.map(_cart => (
              <div className="row" key={`#checkout-cart-${_cart.product.id}`}>
                <label>
                  {_cart.product.title}{" "}
                  <strong className="bold">x {_cart.amount}</strong>{" "}
                </label>
                <div>
                  <span className="highlight">
                    $
                    {(
                      _cart.amount *
                      ((_cart.product.price * (100 - _cart.product.discount)) /
                        100)
                    ).toFixed(2)}
                  </span>
                  {_cart.product.discount !== 0 && (
                    <strike className="ml-1">
                      ${(_cart.amount * _cart.product.price).toFixed(2)}
                    </strike>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="row">
            <label className="bold">Delivery: </label>
            <div>Free</div>
          </div>
          <div className="row no-border">
            <label className="bold">Total: </label>
            <div>${this.context.cart.total.toFixed(2)}</div>
          </div>

          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                <strong>
                  <small>Payment option:</small>
                </strong>
              </FormLabel>
              <RadioGroup
                value={this.state.billingInfo.cashStyle}
                name="cash"
                onChange={e => {
                  this._mapHandleFromForm("cashStyle", Number(e.target.value));
                }}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio id="car-0" />}
                  label={<label htmlFor="car-0">Cash on delivery</label>}
                />
                <FormControlLabel
                  value={1}
                  control={<Radio id="car-1" />}
                  label={
                    <label className="d-flex" htmlFor="car-1">
                      Paypal{" "}
                      <img
                        className="ml-4"
                        src="/img/paypal.png"
                        alt="paypal"
                      />
                    </label>
                  }
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <button
          className="btn-awesome primary client-summary-checkout pos-relative"
          onClick={this._checkout}
          disabled={
            !(
              this._validateOrder() === 0 &&
              this.state.email_error.current === 0 &&
              !this.state.billingInfo.successed
            )
          }
        >
          Checkout
          <div
            className={[
              "btn-paypal",
              cashStyle === 1 &&
              this._validateOrder() === 0 &&
              this.state.email_error.current === 0 &&
              !this.state.billingInfo.successed
                ? "show"
                : ""
            ].join(" ")}
            ref={ref => (this.paypalButtonRef = ref)}
          >
            <PaypalButton
              currency="USD"
              total={Number(this.context.cart.total.toFixed(2))}
              onCancel={this._cancelPaypalCheckout}
              onSuccess={this._successedPaypalCheckout}
            />
          </div>
        </button>
      </div>
    );
  };

  render() {
    return (
      <>
        <BannerHeader
          background="/img/bg_header_5.jpg"
          color="#29203ccf"
          type="title-with-custom-nav"
          title={"Checkout"}
          nav={this.state.nav}
        />

        <LoadingComponent open={this.state.billingInfo.submitting} fulldark />

        <Container className="pt-24 pos-relative">
          {this.state.billingInfo.successed && (
            <div
              className="blur-hidden overlay"
              style={{
                zIndex: 10,
                width: "calc(100vw - 12px)",
                left: "50%",
                transform: "translateX(-50%)"
              }}
            />
          )}
          <div className="alert-container">
            <AlertCustom border icon type="info">
              Returning customer? Click here to login
            </AlertCustom>

            <form className="form-checkout">
              <Grid container>
                <Grid item lg={8} md={8} sm={12} xs={12} className="pr-8-md">
                  {this._leftContent()}
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="pl-8-md">
                  {this._rightContent()}
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
        <Container className="pt-12 pb-24">
          <Grid container>
            <Grid item lg={8} md={8} sm={12} xs={12} className="pr-8-md">
              {this.state.successedAlert && (
                <AlertCustom
                  border
                  icon
                  remove={false}
                  type="success"
                  alignItems="flex-start"
                >
                  {this.state.successedAlert}
                </AlertCustom>
              )}
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default withRouter(withSnackbar(Checkout));
