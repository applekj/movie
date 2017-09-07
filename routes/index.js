var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comment');
var checkLogin = require('../middlewares/check').checkLogin;
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var Category = require('../models/category');
var count = 2;

//主页
router.get('/',function(req,res){
  //console.log(req.session.user);
  //res.locals.user = req.session.user;
  Category.findByCategories(function(err,categories){
    if (err) {
      console.log(err);
    }
    res.render('index',{
      categories:categories
    });
  });
});

//电影页
router.get('/movie/:id',function(req,res){
  var id = req.params.id;
  Movie.updatePV(id,function(err){
    if (err) {console.log(err);}
  });
  Movie.findOne(id,function(err,movie){
    if (err) {
      console.log(err);
    }
    Comment.findByMovieId(movie._id,function(err,comments){
      res.render('detail',{
        movie:movie,
        comments:comments
      });
    });
  });
});

//登出
router.get('/layout',checkLogin,function(req,res){
  delete req.session.user;
  delete res.locals.user;
  res.redirect('/');
});

//登录页
router.get('/signin',checkNotLogin,function(req,res){
  res.render('signin');
});

router.post('/user/signin',checkNotLogin,function(req,res){
  var name = req.body.name;
  var password = req.body.password;

  User.findByUser(name,function(err,result){
    if (err) {
      console.log(err);
    }else if (!result) {
      return res.redirect('/signup');
    }else{
      var psw = result.password;
      User.comparePassword(password,psw,function(err,isMatch){
        if (err) {
          console.log(err);
        }else if (isMatch) {
          req.session.user = result;
          res.redirect('/')
        }else{
          console.log('Password is not matched');
          res.redirect('/signup');
        }
      });
    }
  });
});

//注册页
router.get('/signup',checkNotLogin,function(req,res){
  res.render('signup');
});

router.post('/user/signup',checkNotLogin,function(req,res){
  var name = req.body.name;
  var user = req.body;

  User.findByUser(name,function(err,result){
    if (err) {
    	console.log(err);
    }else if(result){
      res.redirect('/signup');
    }else{
    	User.save(user,function(err,user){
        if (err) {
        	console.log(err);
        }
        res.redirect('/signin');
    	});
    }
  });
});


//电影分类或搜索结果页
router.get('/results',function(req,res){
  var catId = req.query.cat;
  var q = req.query.q;
  var page = parseInt(req.query.p,10) || 0;
  var index = page*count;

  if (catId) {
    Category.findByCategoryId(catId,function(err,category){
      if (err) {
        console.log(err);
      }
      var movies = category.movies.slice(index,index+count);
      res.render('results',{
        movies:movies,
        category:category,
        currentPage:(page + 1),
        totalPage:Math.ceil(category.movies.length/count),
        query:'cat='+catId,
        keyword:category.name
      }); 
    });
  }else{
    Movie.findByMovieTitle(new RegExp(q+'.*','i'),function(err,results){
      if (err) {
        console.log(err);
      }
      var movies = results.slice(index,index+count);
      res.render('results',{
        keyword:q,
        currentPage:(page+1),
        query:'q='+q,
        totalPage:Math.ceil(results.length/count),
        movies:movies
      });
    });
  }

});

module.exports = router;