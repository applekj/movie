var mongoose = require('mongoose');
var User = require('../lib/mongo').User;
var bcrypt = require('bcrypt');

module.exports = {
	comparePassword:function comparePassword(_psw,psw,cb){
		return bcrypt.compare(_psw,psw,cb);
	},
	save:function save(data,cb){
		var user = new User(data);
		return user.save(cb);
	},
	findOne:function findOne(id,cb){
		return User.findOne({_id:id}).exec(cb);
	},
	findByUser:function findByUser(name,cb){
		return User.findOne({name:name}).exec(cb);
	},
	find:function find(cb){
		return User.find({}).exec(cb);
	},
	remove:function remove(id,cb){
		return User.remove({_id:id}).exec(cb);
	}
}