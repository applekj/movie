var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var User = require('../models/user');
var Comment = require('../models/comment');
var checkLogin = require('../middlewares/check').checkLogin;
var checkPermission = require('../middlewares/check').checkPermission;
var savePoster = require('../middlewares/check').savePoster;
var Category = require('../models/category');

//电影录入页
router.get('/input',checkLogin,checkPermission,function(req,res){
	Category.findByCategories(function(err,categories){
    res.render('admin',{
  		title:'admin',
      categories:categories,
  		movie:{
        category:'',
  			_id:'',
  			title:'',
  			doctor:'',
  			country:'',
  			language:'',
  			poster:'',
  			flash:'',
  			year:'',
  			summary:''
  	  }
    });
	});
});

router.post('/input',checkLogin,checkPermission,savePoster,function(req,res){
  var movie = {
    category:req.body.categoryName,
  	title:req.body.title,
  	doctor:req.body.doctor,
  	country:req.body.country,
  	language:req.body.language,
  	poster:req.body.poster,
  	flash:req.body.flash,
  	year:req.body.year,
  	summary:req.body.summary
  };
  var movieId = req.body._id;
  var categoryText = req.body.category;

  if (movieId || req.body.categoryName) {
    Movie.save(movie,function(err,movie){
    	if (err) {
    		console.log(err);
    	}
      Category.findByCategoryId(movie.category,function(err,category){
        if (err) {
          console.log(err);
        }
        category.movies.push(movie._id);
        Category.save(category,function(err,cb){
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/movie/list')
        });
      });
    });
  }else{
    Category.save({name:categoryText},function(err,result){
      movie.category = result._id;
      Movie.save(movie,function(err,movie){
        if (err) {
          console.log(err);
        }
        result.movies.push(movie._id);
        Category.save(result,function(err,category){
          if (err) {
            console.log(err);
          }
          res.redirect('/admin/movie/list');
        });
      });
    });
  }
});

//电影列表页
router.get('/list',checkLogin,checkPermission,function(req,res){
  Movie.find(function(err,movies){
    if (err) {
      console.log(err);
    }
    res.render('movielist',{
      movies:movies
    });
  });
});

//后台电影删除
router.post('/remove',checkLogin,checkPermission,function(req,res){
  var id = req.query.id;
  if(id){
    Movie.remove(id,function(err,movie){
      if (err) {
        console.log(err);
      }else{
        res.json({success:1});
      }
    });
  }
});

//后台电影修改页
router.get('/:id',checkLogin,checkPermission,function(req,res){
  var id = req.params.id;
  if(id){
    Movie.findOne(id,function(err,movie){
      if (err) {
        console.log(err);
      }
      Category.findByCategories(function(err,result){
        res.render('admin',{
          movie:movie,
          categories:result
        });
      });
    });
  }
});

module.exports = router;