const model = require('../models');

const {BlogTags, Employee} = model;

class BlogTagsController{
  findByTags(req, res){
    BlogTags.findAll({
      include: [{
        model: Employee,
        attributes: ['id', 'email']
      }]
    })
    .then(rs => {
      res.send(rs);
    })
    .catch(err => {
      console.log(err);
      
      res.send('error');
    })

  } 
}
module.exports = new BlogTagsController();