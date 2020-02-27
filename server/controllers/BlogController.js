const helper = require("../helper/helper");
const model = require("../models");

const { Blog, BlogTags, MapBlogTag } = model;

class BlogController {
  async find(config) {
    return new Promise((res, rej) => {
      const { limit, offset, order } = config || {};
      let _config = {
        include: [
          {
            model: BlogTags,
            required: false
          }
        ],
        offset: offset || 0,
        order: order || [["createdAt", "DESC"]]
      }
      if(limit){
        _config.limit = limit;
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
  lastestBlog(req, res) {
    this.find({limit: 3, offset: 0})
    .then(rs => {
      res.send(helper.getStatus('success', 'Successful', rs));
    })
    .catch(err => {
      res.send(helper.getStatus('err', 'Fetch lastest blog failed'));
    })

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
}
module.exports = new BlogController();
