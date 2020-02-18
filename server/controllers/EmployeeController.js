const model = require("../models");

const { Role, Employee } = model;
const helper = require("../helper/helper");
const adminAuth = require("../middlewares/admin");

class EmployeeController {
  findAll(req, res) {
    Employee.findAll({
      include: [
        {
          model: Role
        }
      ],
      attributes: ["id", "email", "role", "createdAt", "active"]
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Something went wrong!"));
      });
  }

  updateByAdmin(req, res) {
    let provideAttributes = helper.checkPostProviderAttributes(req, res, ['id']);

    if(!provideAttributes) return;

    return Employee.findOne({
      where: {
        id: provideAttributes.id
      }
    })
    .then(employee => {
      if(!employee){
        return res.send(helper.getStatus('error', `Can't find employee with identity ${provideAttributes.id}`))
      }
      if(employee.role === 1){
        return res.send(helper.getStatus('error', `Permission denied`))
      }


      let {role, active} = req.body;
      
      employee.update({
        role: role || employee.role,
        active: active !== undefined ? active : employee.active
      })
      .then(rs => {
        res.send(helper.getStatus('success', `Update employee successful with identity ${provideAttributes.id}`, rs));
      })
      .catch(err => {
        res.send(helper.getStatus('error', 'Update employee failed!'));
      })
    })
    .catch(err => {
      res.send(helper.getStatus('error', 'Update employee failed!'));
    })


  }

  register(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "email",
      "password"
    ]);

    if (!providerAttributes) return;

    Employee.create({
      email: providerAttributes.email,
      password: providerAttributes.password
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("error", "Something went wrong!"));
      });
  }

  login(req, res) {
    let provideAttributes = helper.checkPostProviderAttributes(req, res, [
      "email",
      "password"
    ]);

    if (!provideAttributes) return;

    return Employee.findOne({
      where: {
        email: provideAttributes.email,
        password: helper.hassPassword(provideAttributes.password)
      },
      attributes: ['id', 'email', 'role', 'active']
    })
      .then(rs => {
        if (rs) {
          let admin = rs.toJSON();

          if (admin.active) {
            res.send(
              helper.getStatus("success", "Successful", {
                token: adminAuth.getAdminToken(rs),
                admin
              })
            );
          } else {
            res.send(
              helper.getStatus("error", `Your account isn't activated. Wait for admin activate.`)
            );
          }
        } else {
          res.send(
            helper.getStatus("error", "Email or password do not match!")
          );
        }
      })
      .catch(err => {
        console.log(err);

        res.send(helper.getStatus("error", "Something went wrong!"));
      });
  }
}

module.exports = new EmployeeController();
