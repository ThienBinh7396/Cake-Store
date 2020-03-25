const model = require("../models");

const { Customer } = model;

const helper = require("../helper/helper");

class CustomerController {
  async checkExists(req, res) {
    res.send(
      helper.getStatus(
        "success",
        "Successful",
        await this._helperGetCustomer({
          email: req.body.email
        }, ['id', 'email', 'phone', 'name', 'thumbnail'])
      )
    );
  }

  async _asyncUpdate(
    id,
    { phone, address, password, name, thumbnail, address_delivery } = {}
  ) {
    return new Promise(res => {
      Customer.findOne({
        where: {
          id
        }
      })
        .then(_customer => {
          if (!_customer) {
            res(null);
          } else {
            _customer
              .update({
                phone: phone ? phone : _customer.phone,
                address: address ? address : _customer.address,
                password: password ? password : _customer.password,
                name: name ? name : _customer.name,
                thumbnail: thumbnail ? thumbnail : _customer.thumbnail,
                address_delivery: address_delivery
                  ? address_delivery
                  : _customer.address_delivery
              })
              .then(_customerUpdate => {
                res(_customerUpdate);
              })
              .catch(err => {
                res(null);
              });
          }
        })
        .catch(err => {
          res(null);
        });
    });
  }

  async _helperCreateAnonymousCustomer({ email, phone, name } = {}) {
    return new Promise(res => {
      let _customer = {
        email,
        thumbnail: "/img/avatar_mask.svg",
        anonymous: 1
      };

      if (phone) {
        _customer["phone"] = phone;
      }
      if (name) {
        _customer["name"] = name;
      }

      Customer.create(_customer)
        .then(customer => {
          res(customer);
        })
        .catch(err => {
          console.log(err);
          res(null);
        });
    });
  }

  async _helperGetCustomer(argumentField, attributes = null) {
    return new Promise(res => {
      let _config = {
        where: {
          ...argumentField
        }
      };

      if(attributes) {
        _config.attributes = attributes
      }

      Customer.findOne(_config)
        .then(customer => {
          res(customer);
        })
        .catch(err => {
          console.log(err);

          res(null);
        });
    });
  }
}

module.exports = new CustomerController();
