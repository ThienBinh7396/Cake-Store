const model = require('../models');

const {BlogTags, Employee} = model;
const helper = require('../helper/helper');

class BlogTagsController{
  findAll(req, res){
    BlogTags.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'email']
      }]
    })
    .then(rs => {
      res.send(helper.getStatus('success', 'successfully', rs));
    })
    .catch(err => {
      console.log(err);
      res.send(helper.getStatus('error', 'Find all tags faild!'));
      
    })

  } 

  async checkExist(alias){
    return new Promise(res => {
      BlogTags.findAll({
        where: {
          alias
        }
      })
      .then(rs => {
        res(rs.length === 0 ? false : true);
      })
      .catch(err => {
        res(true);
      })
    })
  }

  async create(req, res){
    let provideAttributes = helper.checkPostProviderAttributes(req, res, ['title', 'alias']);

    if(!provideAttributes) return;

    let check = await this.checkExist(provideAttributes.alias);

    if(check){
      res.send(helper.getStatus('error', `Alias was taken! You can't get this title`));
    }else{
      return BlogTags.create({
        title: provideAttributes.title,
        alias: provideAttributes.alias,
        employee_update_id: req.auth.id
      })
      .then(rs => {
        if(!rs){
          res.send(helper.getStatus('error', 'Create tag failed'));
        }else{
          res.send(helper.getStatus('success', 'Create tag successfully', rs));
        }
      })
      .catch(err => {
        console.log(err);
        res.send(helper.getStatus('error', 'Create tag failed'));
      })
    }
  }

  async update(req, res){
    let provideAttributes = helper.checkPostProviderAttributes(req, res, ['id', 'title', 'alias']);

    let check = await this.checkExist(provideAttributes.alias);

    if(check){
      res.send(helper.getStatus('error', `Alias was taken! You can't get this title`));
    }else{
      return BlogTags.findOne({
        id: provideAttributes.id
      })
      .then(tag => {
        if(!tag){
          res.send(helper.getStatus('error', `Can't find tag with identity ${provideAttributes.id}`));
        }else{
          tag.update({
            title: provideAttributes.title,
            alias: provideAttributes.alias
          })
          .then(rs => {
            if(rs){
              res.send(helper.getStatus('success', 'Update tag successfully', rs));
            }else{
              res.send(helper.getStatus('error', 'Update tag failed'));
            }
          })
          .catch(err => {
            res.send(helper.getStatus('error', 'Update tag failed'));

          })

        }
      })
      .catch(err => {
        res.send(helper.getStatus('error', 'Update tag failed'));
      })
    }
  }


  delete(req, res){
    let provideAttributes = helper.checkPostProviderAttributes(req, res, ['id']);

    return BlogTags.findOne({
      where: {
        id: provideAttributes.id
      }
    })
    .then(rs =>{
      if(!rs){
        res.send(helper.getStatus('error', 'Delete tags failed'));
      }else{
        BlogTags.destroy({
          where: {
            id: provideAttributes.id
          }
        })
        .then(rs => {
          res.send(helper.getStatus('success', 'Delete tags successfully'))
        })
        .catch(err => {
          res.send(helper.getStatus('error', 'Delete tags failed'))
        })
      }
    })
    .catch(err =>{
      console.log(err);
      res.send(helper.getStatus('error', 'Delete tags failed'))
    })
  }
}
module.exports = new BlogTagsController();