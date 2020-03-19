const model = require("../models");

const { Customer } = model;

class CustomerController {
  async _helperCreateAnonymousCustomer(email) {
    return new Promise(res => {
      Customer.create({
        email,
        thumbnail: "/img/avatar_mask.svg",
        anonymous: 1
      })
        .then(customer => {
          res(customer);
        })
        .catch(err => {
          console.log(err);
          res(null);
        });
    });
  }

  async _helperGetCustomer(argumentField) {
    return new Promise(res => {
      Customer.findOne({
        where: {
          ...argumentField
        }
      })
        .then(customer => {
          res(customer);
        })
        .catch(err => {
          res(null);
        });
    });
  }
}

module.exports = new CustomerController();
