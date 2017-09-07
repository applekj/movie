var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comment');
var checkLogin = require('../middlewares/check').checkLogin;
var checkPermission = require('../middlewares/check').checkPermission;
var Category = require('../models/category');

//电影分类录入页
router.get('/',checkLogin,checkPermission,function(req,res){
  res.render('category',{
    title:'电影分类录入页',
    category:{
      name:''
    }
  });
});

router.post('/',checkLogin,checkPermission,function(req,res){
  var category = {
    name:req.body.name
  };
  Category.save(category,function(err,category){
    if (err) {
      console.log(err);
    }
    res.redirect('/admin/category/list');
  });
});

//电影分类列表页
router.get('/list',checkLogin,checkPermission,function(req,res){
  Category.findByCategories(function(err,categories){
    if (err) {
      console.log(err);
    }
    res.render('categorylist',{
      categories:categories
    });
  });
});


module.exports = router;