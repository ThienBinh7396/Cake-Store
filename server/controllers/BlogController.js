const helper = require("../helper/helper");
const model = require("../models");

const { Blog, BlogTags, BlogComment, MapBlogTag, Customer } = model;
const CustomerController = require("./CustomerController");

const sequelize = require("sequelize");

const { Op } = sequelize;

class BlogController {
  async count(where) {
    return new Promise(res => {
      let config = {
        attributes: [[sequelize.fn("count", sequelize.col("*")), "count"]]
      };

      if (where) {
        config.where = where;
      }

      Blog.findAll(config)
        .then(rs => {
          res(rs[0].toJSON().count);
        })
        .catch(err => {
          res(null);
        });
    });
  }
  async find(config) {
    return new Promise((res, rej) => {
      const { limit, offset, order, where } = config || {};
      let _config = {
        include: [
          {
            model: BlogTags,
            required: false
          },
          {
            model: Customer,
            required: false
          },
          {
            model: BlogComment,
            required: false,
            include: {
              model: Customer,
              required: false
            }
          }
        ],
        offset: offset || 0,
        order: order || [["createdAt", "DESC"]]
      };
      if (limit) {
        _config.limit = limit;
      }
      if (where) {
        _config.where = where;
      }

      Blog.findAll(_config)
        .then(rs => {
          res(rs);
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  async filterWithTag(field, value) {
    return new Promise(res => {
      let _where = {};
      _where[field] = value;

      MapBlogTag.findAll({
        include: [
          {
            model: BlogTags,
            where: _where
          }
        ]
      })
        .then(tags => {
          console.log("Tags: ", tags);
          res(tags.map(it => it.toJSON().blog_id));
        })
        .catch(err => {
          console.log("ERR", err);
          res([]);
        });
    });
  }

  async filter(req, res) {
    let { page, pageLength, query, tag, sortBy } = req.query;

    let config = {
      page: page !== null && page !== undefined ? page : 0,
      pageLength:
        pageLength !== null && pageLength !== undefined ? pageLength : 5,
      query: query !== null && query !== undefined ? query : "",
      tag: tag !== null && tag !== undefined ? tag : "all",
      sortBy:
        sortBy !== null && sortBy !== undefined
          ? JSON.parse(sortBy)
          : ["createdAt", "DESC"]
    };

    let _where = {
      title: {
        [Op.like]: `%${config.query}%`
      },
      status: 1
    };

    if (config.tag.toLocaleLowerCase() !== "all") {
      let mapBlogIdWithTag = await this.filterWithTag("alias", config.tag);
      _where.id = {
        [Op.in]: mapBlogIdWithTag
      };
    }

    let _order = [config.sortBy];

    let filterConfig = {
      count: true,
      offset: config.page * config.pageLength,
      limit: config.pageLength,
      order: _order,
      where: _where
    };

    this.find(filterConfig)
      .then(async rs => {
        res.send(
          helper.getStatus("success", "Successful!", {
            data: rs,
            count: await this.count(_where)
          })
        );
      })
      .catch(err => {
        res.send(
          helper.getStatus(
            "error",
            err.errors
              ? err.errors.map(it => it.message)
              : "Filter blog failed!"
          )
        );
      });
  }

  lastestBlog(req, res) {
    this.find({
      limit: 3,
      offset: 0,
      where: {
        status: 1
      }
    })
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("err", "Fetch lastest blog failed"));
      });
  }

  findAll(req, res) {
    this.find()
      .then(rs => {
        res.send(helper.getStatus("success", "Successful", rs));
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus("error", "Something went wrong!"));
      });
  }

  async helperMapBlogWithTags(blogId, tags) {
    return new Promise(res => {
      MapBlogTag.destroy({
        where: {
          blog_id: blogId
        }
      })
        .then(rs => {
          if (tags.length === 0) return res(true);

          MapBlogTag.bulkCreate(
            tags.map(it => {
              return {
                blog_id: blogId,
                tag_id: it.id
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

  async helperFindOne(blogId) {
    return new Promise(res => {
      Blog.findOne({
        where: {
          id: blogId
        },
        include: [
          {
            model: BlogTags,
            required: false
          },
          {
            model: Customer,
            required: false
          },
          {
            model: BlogComment,
            required: false,
            include: {
              model: Customer,
              required: false
            }
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

  async findOne(req, res) {
    let providerAttributes = helper.checkGetProviderAttributes(req, res, [
      "id"
    ]);
    if (!providerAttributes) return;

    let result = await this.helperFindOne(providerAttributes.id);

    if (result) {
      res.send(helper.getStatus("success", "Successful", result));
    } else {
      res.send(
        helper.getStatus(
          "error",
          `Can't find blog with identity ${providerAttributes.id}`
        )
      );
    }
  }

  create(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "title",
      "content",
      "thumbnail",
      "status",
      "tags"
    ]);

    if (!providerAttributes) return;

    Blog.create({
      title: providerAttributes.title,
      content: providerAttributes.content,
      thumbnail: providerAttributes.thumbnail,
      status: providerAttributes.status,
      tags: providerAttributes.tags,
      upload_id: req.auth.type === "admin" ? -1 : req.auth.id
    })
      .then(async rs => {
        if (rs) {
          let result = await this.helperMapBlogWithTags(
            rs.id,
            providerAttributes.tags
          );
          if (result) {
            res.send(
              helper.getStatus(
                "success",
                "Create blog successfully",
                await this.helperFindOne(rs.id)
              )
            );
          } else {
            res.send(helper.getStatus("error", "Create blog failed!"));
          }
        } else {
          res.send(helper.getStatus("error", "Create blog failed!"));
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Create blog failed!"));
      });
  }

  update(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "id",
      "title",
      "content",
      "thumbnail",
      "status",
      "tags"
    ]);

    if (!providerAttributes) return;

    return Blog.findOne({
      where: {
        id: providerAttributes.id
      }
    })
      .then(async blog => {
        if (!blog) {
          res.send(
            helper.getStatus(
              "error",
              `Can't find blog with identity ${providerAttributes.id}`
            )
          );
        } else {
          if (
            req.auth.type !== "admin" &&
            req.auth.id !== blog.toJSON().upload_id
          ) {
            return res.send(
              helper.getStatus(
                "error",
                `You don't have permission to modify this blog!`
              )
            );
          }

          let result = await this.helperMapBlogWithTags(
            providerAttributes.id,
            providerAttributes.tags
          );

          if (result) {
            blog
              .update({
                title: providerAttributes.title || blog.title,
                content: providerAttributes.content || blog.content,
                thumbnail: providerAttributes.thumbnail || blog.thumbnail,
                status: providerAttributes.status
              })
              .then(async rs => {
                res.send(
                  helper.getStatus(
                    "success",
                    "Update blog successfully",
                    await this.helperFindOne(rs.id)
                  )
                );
              })
              .catch(err => {
                res.send(helper.getStatus("error", "Update blog failed!"));
              });
          } else {
            res.send(helper.getStatus("error", "Update blog failed!"));
          }
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Update blog failed!"));
      });
  }

  delete(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "id"
    ]);

    if (!providerAttributes) return;

    Blog.findOne({
      where: {
        id: providerAttributes.id
      }
    })
      .then(async blog => {
        if (blog) {
          if (
            req.auth.type !== "admin" &&
            req.auth.id !== blog.toJSON().upload_id
          ) {
            return res.send(
              helper.getStatus(
                "error",
                `You don't have permission to modify this blog!`
              )
            );
          }

          await this.helperMapBlogWithTags(providerAttributes.id);

          Blog.destroy({
            where: {
              id: providerAttributes.id
            }
          })
            .then(rs => {
              res.send(helper.getStatus("success", "Delete blog successful!"));
            })
            .catch(err => {
              res.send(
                helper.getStatus(
                  "error",
                  err.errors
                    ? err.errors.map(it => it.message)
                    : "Delete blog failed!"
                )
              );
            });
        } else {
          res.send(
            helper.getStatus(
              "error",
              `Can't find blog with identity ${providerAttributes.id}`
            )
          );
        }
      })
      .catch(err => {
        res.send(helper.getStatus("error", "Delete blog failed!"));
      });
  }

  async _helperFindOne(commentId) {
    return new Promise(res => {
      BlogComment.findOne({
        where: {
          id: commentId
        },
        include: {
          model: Customer
        }
      })
        .then(_comment => {
          res(_comment);
        })
        .catch(err => {
          console.log("Helper find one comment faild: ", err);

          res(null);
        });
    });
  }

  async createComment(req, res) {
    let providerAttributes = helper.checkPostProviderAttributes(req, res, [
      "blogId",
      "email",
      "content",
      "signIn"
    ]);

    if (!providerAttributes) return;

    const { blogId, email, content, signIn } = providerAttributes;

    console.log({ blogId, email, content, signIn });

    let _createNewCustomer = false;

    if (!signIn) {
      let check = await CustomerController._helperGetCustomer({ email });

      if (check) {
        if (check.anonymous !== 1) {
          res.send(
            helper.getStatus(
              "warning",
              `<strong>${email}</strong> has been taken! <br>You can login or choose orther.`
            )
          );
          return;
        }
      } else {
        _createNewCustomer = true;
      }
    }

    let _customer = !_createNewCustomer
      ? await CustomerController._helperGetCustomer({ email })
      : await CustomerController._helperCreateAnonymousCustomer({email});

    if (!_customer) {
      res.send(helper.getStatus("error", "Something went wrong. Try again!"));
      return;
    } else {
      BlogComment.create({
        blog_id: blogId,
        customer_info: _customer.id,
        content
      })
        .then(async _comment => {
          res.send(
            helper.getStatus(
              "success",
              "Thank you for giving us a comment!",
              await this._helperFindOne(_comment.toJSON().id)
            )
          );
        })
        .catch(err => {
          res.send(helper.getStatus("error", "Send review failed!"));
        });
    }

  }
}
module.exports = new BlogController();
