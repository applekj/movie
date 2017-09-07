var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comment');
var checkLogin = require('../middlewares/check').checkLogin;
var checkPermission = require('../middlewares/check').checkPermission;
var Category = require('../models/category');

//用户评论
router.post('/',checkLogin,function(req,res,next){
  var comment = req.body;
  var movieId = comment.movie;
  if (comment.cid) {
    Comment.findByCommentId(comment.cid,function(err,result){
      var reply = {
        from:comment.from,
        to:comment.tid,
        content:comment.content
      };
      result.reply.push(reply);
      Comment.save(result,function(err,comment){
        if (err) {
          console.log(err);
        }
        res.redirect('back');
      });
    });
  } else{
    Comment.save(comment,function(err,comment){
      if(err){
        console.log(err);
      }
      res.redirect('back');
    })
  }
});

module.exports = router;