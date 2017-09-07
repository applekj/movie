var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var router = require('./routes/router');
var path = require('path');
var multipart = require('connect-multiparty');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');

app.locals.moment = require('moment');

app.set('views','./views');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(multipart());
app.use(session({
	name:'user',
	secret:'yanjingjie',
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:18000000
	},
	store:new MongoStore({
		url:'mongodb://localhost:27017/movie'
	})
}));

app.use(function(req,res,next){
	res.locals.user = req.session.user;
	next();
})

//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

if ('development' === app.get('env')) {
	app.set('showStackError',true);
	//app.use(express.logger(':method :url :status'));
	/*morgan('tiny');
	morgan(':method :url :status');*/
	morgan.format('joke','[joke] :method :url :status');
	app.use(morgan('joke'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

router(app);

app.listen(3000,function(err){ 
	if (err) {
		console.log(err);
	}
	console.log('程序在3000端口启动');
});