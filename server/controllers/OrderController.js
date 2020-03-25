const { Order, OrderDetails } = require("../models");
const helper = require("../helper/helper");
const mail = require("../helper/mail");
const order = require("./../helper/template/order.js");


const CustomerController = require("./CustomerController");

const CryptoJS = require("crypto-js");

class OrderController {
  async _createOrderDetailsByOrder(order_id, cart) {
    return new Promise(res => {
      OrderDetails.bulkCreate(
        cart.map(_cart => {
          return { ..._cart, order_id };
        })
      )
        .then(rs => {
          res(rs);
        })
        .catch(err => {
          console.log(err);

          res(null);
        });
    });
  }

  _asyncFindOneOrder = id => {
    return new Promise(res => {
      Order.findOne({
        where: {
          id
        }
      })
        .then(rs => {
          res(rs);
        })
        .catch(err => {
          res(null);
        });
    });
  };

  async create(req, res) {
    const providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "payment_info",
      "customer",
      "note",
      "address_delivery",
      "cart"
    ]);

    if (!providerAttributes) return;

    const {
      payment_info,
      customer,
      note,
      address_delivery,
      cart
    } = providerAttributes;

    let _customer = await CustomerController._helperGetCustomer({
      email: customer.email
    });

    if (!customer.loggin) {
      if (_customer && _customer.toJSON().anonymous === 0) {
        return res.send(helper.getStatus("error", "Email is already taken!"));
      }

      if (!_customer) {
        _customer = await CustomerController._helperCreateAnonymousCustomer({
          ...customer
        });
      }
    }

    let order_code = CryptoJS.MD5(`order-${Date.now()}`).toString();

    Order.create({
      order_code,
      customer_id: _customer.toJSON().id,
      note,
      address_delivery: JSON.stringify(address_delivery),
      status: 0,
      payment_info: JSON.stringify(payment_info)
    })
      .then(async _order => {
        await this._createOrderDetailsByOrder(_order.toJSON().id, cart);

        await CustomerController._asyncUpdate(_customer.toJSON().id, {
          address_delivery,
          name: customer.name
        });

        mail.sendMail({
          to: customer.email,
          subject: "📌 Cake Stores - Your order is comfirmed!",
          html: order.renderOrderConfirmHtml({customer, cart, address_delivery, payment_info, order_code})
        });

        res.send(helper.getStatus("success", "Successful", _order));
      })
      .catch(err => {
        console.log(err);

        res.send(helper.getStatus("error", "Create order failed!"));
      });
  }
}

module.exports = new OrderController();
