var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost:27017/movie';
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//使用mongoose的promise
mongoose.Promise = global.Promise;

//连接数据库
mongoose.connect(dbUrl);

mongoose.connection.on('connected',function(){
	console.log('mongoose connected on'+dbUrl);
});

mongoose.connection.on('error',function(err){
	console.log('mongoose connection error'+err);
});

mongoose.connection.on('disconnected',function(){
	console.log('mongoose disconnected');
});

//定义电影模式
var movieSchema = new mongoose.Schema({
	category:{
		type:ObjectId,
		ref:'Category'
	},
  doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

movieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//定义用户模式
var userSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

userSchema.pre('save',function(next){
	var user = this;
  if (this.isNew) {
  	this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
  	this.meta.updateAt = Date.now();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if (err) {
      console.log(err);
    }
    bcrypt.hash(user.password,salt,function(err,hash){
    	if (err) {
    		console.log(err);
    	}
      user.password = hash;
      next();
    });
  });
});

//定义评论模式
var commentSchema = new mongoose.Schema({
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	//to:{type:ObjectId,ref:'User'},
	content:String,
	reply:[{
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'},
		content:String
	}],
  meta:{
  	createAt:{
  		type:Date,
  		default:Date.now()
  	},
  	updateAt:{
  		type:Date,
  		default:Date.now()
  	}
  }
});

commentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//定义电影分类模式
var categorySchema = new mongoose.Schema({
	name:{type:String},
	movies:[{type:ObjectId,ref:'Movie'}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
  }
});

categorySchema.pre('save',function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

exports.Comment = mongoose.model('Comment',commentSchema);
exports.Movie = mongoose.model('Movie',movieSchema);
exports.User = mongoose.model('User',userSchema);
exports.Category = mongoose.model('Category',categorySchema);