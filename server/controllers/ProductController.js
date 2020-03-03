const model = require("../models");

const { Product, Gallery, Category, MapProductWithCategory } = model;

const helper = require("../helper/helper");

const data = require("./../MOCK_DATA.json");

const sequelize = require("sequelize");

const { Op } = sequelize;

// Product.bulkCreate(data)
// .then(rs => {
//   console.log(rs);
// })
// .catch(err => {
//   console.log(err);
// })

class CakeCategoriesController {
  async count(where) {
    return new Promise(res => {
      let config = {
        attributes: [[sequelize.fn("count", sequelize.col("*")), "count"]]
      };

      if (where) {
        config.where = where;
      }

      Product.findAll(config)
        .then(rs => {
          res(rs[0].toJSON().count);
        })
        .catch(err => {
          res(null);
        });
    });
  }

  findOne(req, res) {
    let providerAttributes = helper.checkGetProviderAttributes(req, res, [
      "id"
    ]);

    if (!providerAttributes) return;

    Product.findOne({
      where: {
        id: providerAttributes.id
      },
      include: [
        {
          model: Category,
          required: false
        },
        {
          model: Gallery
        }
      ]
    })
      .then(rs => {
        if (!rs) {
          res.send(
            helper.getStatus(
              "error",
              `Can't find product with identity ${providerAttributes.id}`
            )
          );
        } else {
          res.send(helper.getStatus("success", "Successful", rs));
        }
      })
      .catch(err => {
        res.send(
          helper.getStatus(
            "error",
            err.errors
              ? err.errors.map(it => it.message)
              : "Filter product failed!"
          )
        );
      });
  }

  async find({ count, limit, offset, order, where }) {
    return new Promise((res, rej) => {
      let config = {
        include: [
          {
            model: Category,
            required: false
          },
          {
            model: Gallery
          }
        ],
        limit,
        offset,
        order: order || [["createdAt", "DESC"]]
      };
      if (where) {
        config.where = where;
      }

      Product.findAll(config)
        .then(async rs => {
          res({
            data: rs,
            count: count ? await this.count(where) : 0
          });
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  async filterWithCategory(field, value) {
    return new Promise(res => {
      console.log("Value", value)
      console.log("Field", field)
      let _where = {}
      _where[field] = value
      MapProductWithCategory.findAll({
        include: [{
          model: Category,
          where: _where
        }]
      })
        .then(categories => {
          res(categories.map(it => it.toJSON().product_id));
        })
        .catch(err => {
          console.log(err);
          res([]);
        });
    });
  }

  async filter(req, res) {
    let providerAttributes = helper.checkGetProviderAttributes(req, res, [
      "page",
      "pageLength",
      "range",
      "status",
      "query",
      "sort",
      "category"
    ]);

    if (!providerAttributes) return;

    let _where = {
      price: {
        [Op.between]: JSON.parse(providerAttributes.range)
      },
      title: {
        [Op.like]: `%${providerAttributes.query}%`
      }
    };

    if (providerAttributes.category !== "all") {
      let mapProductIdWithCategory = await this.filterWithCategory(
        'alias', providerAttributes.category
      );
      _where.id = {
        [Op.in]: mapProductIdWithCategory
      };
    }

    if (providerAttributes.status) {
      _where.status = providerAttributes.status;
    }

    let _order = [JSON.parse(providerAttributes.sort)];

    let filterConfig = {
      count: true,
      offset: providerAttributes.page * providerAttributes.pageLength,
      limit: providerAttributes.pageLength,
      order: _order,
      where: _where
    };

    this.find(filterConfig)
      .then(rs => {
        res.send(helper.getStatus("success", "Successful!", rs));
      })
      .catch(err => {
        console.log(err);

        res.send(
          helper.getStatus(
            "error",
            err.errors
              ? err.errors.map(it => it.message)
              : "Filter product failed!"
          )
        );
      });
  }

  newProducts(req, res) {
    this.find({
      limit: 8,
      offset: 0
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Fetch data failed!"));
      });
  }

  topSell(req, res) {
    this.find({
      limit: 5,
      offset: 0,
      order: [["sold", "DESC"]]
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Fetch data failed!"));
      });
  }
  topDiscounts(req, res) {
    this.find({
      limit: 5,
      offset: 0,
      order: [["discount", "DESC"]]
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Fetch data failed!"));
      });
  }

  async helperMapProductWithCategory(productId, categories) {
    return new Promise(res => {
      MapProductWithCategory.destroy({
        where: {
          product_id: productId
        }
      })
        .then(rs => {
          if (categories.length === 0) return res(true);

          MapProductWithCategory.bulkCreate(
            categories.map(it => {
              return {
                product_id: productId,
                category_id: it.id
              };
            })
          )
            .then(rs => {
              res(true);
            })
            .catch(err => {
              res(false);
            });
        })
        .catch(err => {
          res(false);
        });
    });
  }

  findAll(req, res) {
    this.find({ limit: 12, offset: 0 })
      .then(rs => {
        res.send(helper.getStatus("success", "successfully", rs));
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Something went wrong!"));
      });
  }

  async helperFindOne(product_id) {
    return new Promise(res => {
      Product.findOne({
        where: {
          id: product_id
        },
        include: [
          { model: Category },
          {
            model: Gallery
          }
        ]
      })
        .then(rs => {
          res(rs);
        })
        .catch(err => {
          res(null);
        });
    });
  }

  async updateGallery(productId, _gallery) {
    return new Promise(res => {
      Gallery.destroy({
        where: {
          product_id: productId
        }
      })
        .then(rs => {
          if (_gallery.length === 0) return res(true);
          Gallery.bulkCreate(
            _gallery.map(it => {
              return {
                product_id: productId,
                url: it.url
              };
            })
          )
            .then(rs => {
              res(true);
            })
            .catch(err => {
              res(null);
            });
        })
        .catch(err => {
          res(null);
        });
    });
  }

  create(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "title",
      "price",
      "discount",
      "description",
      "status",
      "thumbnail",
      "gallery",
      "categories"
    ]);

    if (!providerAttributes) return;

    return Product.create({
      title: providerAttributes.title,
      price: providerAttributes.price,
      discount: providerAttributes.discount,
      description: providerAttributes.description,
      status: providerAttributes.status,
      thumbnail: providerAttributes.thumbnail,
      employee_update_id: req.auth.id
    })
      .then(async rs => {
        console.log(rs);
        if (!rs) {
          res.send(helper.getStatus("error", "Create product failed!"));
        } else {
          let product = rs.toJSON();
          console.log(rs.toJSON());

          let mapResult = await this.helperMapProductWithCategory(
            product.id,
            providerAttributes.categories
          );

          let result = await this.updateGallery(
            product.id,
            providerAttributes.gallery
          );

          if (result && mapResult) {
            res.send(
              helper.getStatus(
                "success",
                "Create product successful!",
                await this.helperFindOne(product.id)
              )
            );
          } else {
            res.send(helper.getStatus("error", "Create product failed!", rs));
          }
        }
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("error", "Create product failed!"));
      });
  }
  update(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "id"
    ]);

    if (!providerAttributes) return;

    return Product.findOne({
      where: {
        id: providerAttributes.id
      }
    })
      .then(_product => {
        if (!_product) {
          res.send(
            helper.getStatus(
              "error",
              `Can't find product with identity ${providerAttributes.id}`
            )
          );
        } else {
          let product = _product.toJSON();

          let {
            title,
            price,
            discount,
            description,
            status,
            thumbnail,
            gallery,
            categories
          } = req.body;

          _product
            .update({
              title: title || _product.title,
              price: price || _product.price,
              discount: discount || _product.discount,
              description: description || _product.description,
              status: status || _product.status,
              thumbnail: thumbnail || _product.thumbnail,
              employee_update_id: req.auth.id
            })
            .then(async _update => {
              if (gallery) {
                let updateGallery = await this.updateGallery(
                  product.id,
                  gallery
                );
                if (!updateGallery) {
                  return res.send(
                    helper.getStatus("error", "Update product failed!")
                  );
                }
              }
              if (categories) {
                let mapCategories = await this.helperMapProductWithCategory(
                  product.id,
                  categories
                );

                if (!mapCategories) {
                  return res.send(
                    helper.getStatus("error", "Update product failed!")
                  );
                }
              }

              return res.send(
                helper.getStatus(
                  "success",
                  "Update product successful!",
                  await this.helperFindOne(product.id)
                )
              );
            })
            .catch(err => {
              res.send(helper.getStatus("error", "Update product failed!"));
            });
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Update product failed!"));
      });
  }

  delete(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "id"
    ]);

    if (!providerAttributes) return;

    return Product.findOne({
      where: {
        id: providerAttributes.id
      }
    })
      .then(async rs => {
        if (!rs) {
          res.send(
            helper.getStatus(
              "error",
              `Can't find product with identity ${providerAttributes.id}!`
            )
          );
        } else {
          await this.updateGallery(providerAttributes.id, []);

          await this.helperMapProductWithCategory(providerAttributes.id, []);

          Product.destroy({
            where: {
              id: providerAttributes.id
            }
          })
            .then(rs => {
              res.send(
                helper.getStatus("success", "Delete product successful!")
              );
            })
            .catch(err => {
              res.send(
                helper.getStatus(
                  "error",
                  err.errors
                    ? err.errors.map(it => it.message)
                    : "Delete product failed!"
                )
              );
            });
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Delete product failed!"));
      });
  }
}

module.exports = new CakeCategoriesController();
