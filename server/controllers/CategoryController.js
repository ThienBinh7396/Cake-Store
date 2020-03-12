const model = require("../models");

const { Category } = model;
const helper = require("../helper/helper");

class CategoryController {
  findAll(req, res) {
    Category.findAll({})
      .then(rs => {
        res.send(helper.getStatus("success", "successfully", rs));
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("error", "Find all categories faild!"));
      });
  }

  async checkExist(alias) {
    console.log("Alias: ", alias);
    return new Promise(res => {
      Category.findAll({
        where: {
          alias
        }
      })
        .then(rs => {
          res(rs.length === 0 ? false : true);
        })
        .catch(err => {
          res(true);
        });
    });
  }

  async create(req, res) {
    let provideAttributes = helper.checkPostProviderAttributes(req, res, [
      "title",
      "alias",
      "thumbnail"
    ]);

    if (!provideAttributes) return;

    let check = await this.checkExist(provideAttributes.alias);

    if (check) {
      res.send(
        helper.getStatus("error", `Alias was taken! You can't get this title`)
      );
    } else {
      return Category.create({
        title: provideAttributes.title,
        alias: provideAttributes.alias,
        thumbnail: provideAttributes.thumbnail
      })
        .then(rs => {
          if (!rs) {
            res.send(helper.getStatus("error", "Create category failed"));
          } else {
            res.send(
              helper.getStatus("success", "Create category successfully", rs)
            );
          }
        })
        .catch(err => {
          console.log(err);
          res.send(helper.getStatus("error", "Create category failed"));
        });
    }
  }
  update(req, res) {
    let provideAttributes = helper.checkPostProviderAttributes(req, res, [
      "id",
      "title",
      "alias",
      "thumbnail"
    ]);

    return Category.findOne({
      where: {
        id: provideAttributes.id
      }
    })
      .then(async category => {
        if (!category) {
          res.send(
            helper.getStatus(
              "error",
              `Can't find category with identity ${provideAttributes.id}`
            )
          );
        } else {
          let check = false;

          console.log(provideAttributes, category.title);
          
          if (provideAttributes.title !== category.title) {
            check = await this.checkExist(provideAttributes.alias);
          }

          if (check) {
            res.send(
              helper.getStatus(
                "error",
                `Alias was taken! You can't get this title`
              )
            );
          } else {
            category
              .update({
                title: provideAttributes.title,
                alias: provideAttributes.alias,
                thumbnail: provideAttributes.thumbnail
              })
              .then(rs => {
                if (rs) {
                  res.send(
                    helper.getStatus(
                      "success",
                      "Update category successfully",
                      rs
                    )
                  );
                } else {
                  res.send(helper.getStatus("error", "Update category failed"));
                }
              })
              .catch(err => {
                res.send(helper.getStatus("error", "Update category failed"));
              });
          }
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Update category failed"));
      });
  }

  delete(req, res) {
    let provideAttributes = helper.checkPostProviderAttributes(req, res, [
      "id"
    ]);

    return Category.findOne({
      where: {
        id: provideAttributes.id
      }
    })
      .then(rs => {
        if (!rs) {
          res.send(helper.getStatus("error", "Delete categories failed"));
        } else {
          Category.destroy({
            where: {
              id: provideAttributes.id
            }
          })
            .then(rs => {
              res.send(
                helper.getStatus("success", "Delete categories successfully")
              );
            })
            .catch(err => {
              res.send(helper.getStatus("error", "Delete categories failed"));
            });
        }
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("error", "Delete categories failed"));
      });
  }
}
module.exports = new CategoryController();
