const model = require("../models");
const jwt = require("jsonwebtoken");

const helper = require("../helper/helper");

const { Employee } = model;

require("dotenv").config();

class AdminAuth {
  async verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
      res.send(helper.getStatus("error", `Token isn't provided!`));
    } else {
      let decoded;

      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        return res.send(helper.getStatus("error", `Token isn't invalid!`));
      }

      let { type, email, id } = decoded;

      if (type !== "admin") {
        return res.send(helper.getStatus("error", `Token isn't invalid!`));
      }

      await Employee.findOne({
        where: {
          id,
          email
        }
      })
        .then(rs => {
          if (rs) {
            let admin = rs.toJSON();

            if (this.role.indexOf(admin.role) < 0) {
              return res.send(helper.getStatus("error", "Permission denied!"));
            } else {
              req.auth = admin;

              next();
            }
          } else {
            return res.send(helper.getStatus("error", `Token isn't invalid!`));
          }
        })
        .catch(err => {
          return res.send(helper.getStatus("error", `Token isn't invalid!`));
        });

    }
  }

  getAdminToken(admin) {
    const token = jwt.sign(
      {
        id: admin.id,
        type: "admin",
        email: admin.email
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    return token;
  }
}

module.exports = new AdminAuth();
