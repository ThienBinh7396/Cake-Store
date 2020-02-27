const model = require("../models");
const { Feedback } = model;
const help = require("../helper/helper");

class FeedbackController {
  getShow(req, res) {
    Feedback.findAll({
      where: {
        show: true
      }
    })
      .then(rs => {
        res.send(help.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        res.send(help.getStatus("error", "Fetch data failded!"));
      });
  }
}

module.exports = new FeedbackController();
