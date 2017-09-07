module.exports = function(app){
	//游客登录路由
	app.use('/',require('./index'));
	//后台管理路由
	app.use('/admin/movie',require('./movie'));
	app.use('/admin/user',require('./user'));
	app.use('/admin/category',require('./category'));
	app.use('/admin/comment',require('./comment'));
};