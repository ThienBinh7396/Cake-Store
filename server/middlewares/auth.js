const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Employee, Customer } = require("../models");

class Auth {
  vetifyToken(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
      res.send(helper.getStatus("error", `Token isn't provided!`));
    } else {
      let decoded;

      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (error) {
        return res.send(helper.getStatus("error", `Token isn't invalid!`));
      }

      let {type, id, email } = decoded;

      if (type === "client") {
        Customer.findOne({
          where: {
            id,
            email
          }
        })
          .then(rs => {
            if (rs) {
              req.auth = rs.toJSON();
              next();
            } else {
              return res.send(
                helper.getStatus("error", `Token isn't invalid!`)
              );
            }
          })
          .catch(err => {
            return res.send(helper.getStatus("error", `Token isn't invalid!`));
          });
      } else {
        Employee.findOne({
          where: {
            id,
            email
          }
        })
          .then(rs => {
            if (rs) {
              req.auth = rs.toJSON();
              next();
            } else {
              return res.send(
                helper.getStatus("error", `Token isn't invalid!`)
              );
            }
          })
          .catch(err => {
            return res.send(helper.getStatus("error", `Token isn't invalid!`));
          });
      }
    }
  }
}

module.exports = new Auth();
