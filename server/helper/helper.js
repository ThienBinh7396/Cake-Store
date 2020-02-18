const CryptoJS = require("crypto-js");

require("dotenv").config();

const dayInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthInYear = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

class Helper {
  checkPostProviderAttributes(req, res, params) {
    let { body } = req;

    let check = true;
    params.forEach(it => {
      if (body[it] == null) {
        res.send(this.getStatus("error", `${it} param isn't provided`));
        check = false;
      }
    });

    return check ? req.body : false;
  }
  checkGetProviderAttributes(req, res, params) {
    let { query } = req;

    let check = true;

    params.forEach(it => {
      if (query[it] == null) {
        res.send(this.getStatus("error", `${it} param isn't provided`));
        check = false;
      }
    });

    return check ? req.query : false;
  }

  getStatus(type, message, data) {
    return { type, message, data };
  }

  
  hassPassword(password) {
    return CryptoJS.HmacSHA1(password, process.env.SECRET_KEY).toString();
  }

  comparePassword(hashPassword, password) {
    let encodePassword = CryptoJS.HmacSHA1(
      password,
      process.env.SECRET_KEY
    ).toString();

    return encodePassword === hashPassword;
  }
  formatNumber(num) {
    return num > 9 ? num : `0${num}`;
  }

  formatDate(str, type) {
    let date = new Date(str);

    let d = date.getDate();
    let month = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    let f = "";
    let full = `${d}/${month}/${y} ${h}:${this.formatNumber(
      m
    )}:${this.formatNumber(s)}`;
    switch (type) {
      case 1: //ex: 10:10pm
        f = `${h > 12 ? h - 12 : h}:${this.formatNumber(m)}${
          h > 12 ? " pm" : " am"
        }`;
        break;

      case 2: //ex: Sat, Aug 29
        console.log(date.getDay());
        f = `${dayInWeek[date.getDay()]}, ${
          monthInYear[month - 1]
        } ${this.formatNumber(d)}`;
        break;

      case 3: //ex: 03/07/1996
        f = `${month}/${d}/${y}`;
        break;

      case 4: //ex: 12:00
        f = `${this.formatNumber(h)}:${this.formatNumber(m)}`;
        break;

      case 5: //ex: 10:10:10pm
        f = `${h}:${this.formatNumber(m)}:${this.formatNumber(s)}`;
        break;
      case 6: //ex: Nov 20, 2019, 8:35 AM
        f = `${monthInYear[month - 1]} ${this.formatNumber(
          d
        )}, ${y}, ${h}:${m}${h > 12 ? "PM" : "AM"}`;
        break;
      case 7: //ex: 03/07/1996
        f = `${month}-${d}-${y}`;
        break;
      default:
    }
    return {
      format: f,
      fullType: full
    };
  }
}

module.exports = new Helper();
