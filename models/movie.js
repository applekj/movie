var mongoose = require('mongoose');
var Movie = require('../lib/mongo').Movie;

module.exports = {
	save:function save(data,cb){
		var movie = new Movie(data);
		return movie.save(cb);
	},
	findOne:function findOne(id,cb){
		return Movie.findOne({_id:id}).populate('category','name -_id').exec(cb);
	},
	find:function find(cb){
		return Movie.find({},cb);
	},
	remove:function remove(id,cb){
		return Movie.remove({_id:id},cb);
	},
	findByMovieTitle:function findByMovieTitle(title,cb){
    return Movie.find({title:title}).exec(cb);
	},
	updatePV:function updatePV(id,cb){
		return Movie.update({_id:id},{$inc:{pv:1}}).exec(cb);
	}
};