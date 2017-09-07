var fs = require('fs');
var path = require('path');

module.exports = {
	checkLogin : function checkLogin(req,res,next){
		if(!req.session.user){
			return res.redirect('/signin');
		}
		next();
	},

	checkNotLogin : function checkNotLogin(req,res,next){
		if (req.session.user) {
			return res.redirect('back');
		}
		next();
	},

	checkPermission : function checkPermission(req,res,next){
		var user = req.session.user;
		if(user.role<10){
      return res.redirect('back');
		}
		next();
	},

	savePoster : function savePoster(req,res,next){
		var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;
		var timestamp = Date.now();
		var type = posterData.type.split('/')[1];
		var poster = timestamp + '.' + type;
		var newPath = path.join(__dirname,'../','/public/image/' + poster);

    if (originalFilename) {
    	fs.readFile(filePath,function(err,data){
    		if (err) throw err;
    		fs.writeFile(newPath,data,function(err){
    			if (err) throw err;
    			req.body.poster = poster;
    			next();
    		});
    	});
    }else{
    	next();
    }
	}
};

