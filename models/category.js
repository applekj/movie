var mongoose = require('mongoose');
var Category = require('../lib/mongo').Category;

module.exports = {
	save:function save(data,cb){
		var category = new Category(data);
		return category.save(cb);
	},
	findByCategory:function findByCategory(name,cb){
		return Category.findOne({category:name}).exec(cb);
	},
	findByCategories:function findByCategories(cb){
		return Category.find({}).populate({path:'movies',options:{limit:5}}).exec(cb);
	},
	findByCategoryId:function findByCategoryId(id,cb){
		return Category.findOne({_id:id}).populate({path:'movies',select:'title poster'}).exec(cb);
	}
};