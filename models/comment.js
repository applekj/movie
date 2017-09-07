var mongoose = require('mongoose');
var Comment = require('../lib/mongo').Comment;

module.exports = {
	save:function save(data,cb){
		var comment = new Comment(data);
		return comment.save(cb); 
	},
	findOne:function findOne(id,cb){
		return Comment.findOne({_id:id}).exec(cb);
	},
	findByMovieId:function findByMovieId(movieId,cb){
		return Comment.find({movie:movieId}).populate('from','name').populate('reply.from reply.to','name').exec(cb);
	},
	findByCommentId:function findByCommentId(commentId,cb){
		return Comment.findOne({_id:commentId}).populate('from','name').populate('reply.from','name').populate('reply.to','name').exec(cb);
	},
	remove:function remove(id,cb){
		return Comment.remove({_id:id}).exec(cb);
	}
}; 