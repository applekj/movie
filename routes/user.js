var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comment');
var checkLogin = require('../middlewares/check').checkLogin;
var checkPermission = require('../middlewares/check').checkPermission;
var Category = require('../models/category');

//用户列表页
router.get('/',checkLogin,checkPermission,function(req,res){
  User.find(function(err,users){
    if (err) {
      console.log(err);
    }
    res.render('userlist',{
      users:users
    });
  });
});

module.exports = router;