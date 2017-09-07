var crypto = require('crypto');
var bcrypt = require('bcrypt');

function getRandomString(len){
	if (!len) {len = 16;}
	return crypto.randomBytes(Math.ceil(len/2).toString('hex'))
}

var should = require('should');
var app = require('../index');
var User = require('../models/user');
var user;

descripe('<Unit Test',function(){
	decripe('Model User:',function(){
		beforeEach(function(done){
			user = {
				name:getRandomString(),
				password:'password'
			}
			done();
		});
		
		descripe('Before Method save',function(){
			it('should begin without test user',function(done){
				User.findByUser(user.name,function(err,user){
					user.should.have.length(0);
					done();
				});
			});
		});
    
    descripe('User save',function(){
    	it('should save without problems',function(done){
    		User.save(user,function(err,result){
    			should.not.exist(err);
    			User.remove(result._id,function(err){
    				should.not.exist(err);
    				done();
    			});
    		});
    	});

    	it('should password be hashed',function(done){
    		var password = user.password;
    		User.save(user,function(err,result){
    			should.not.exist(err);
    			user.password.should.not.have.length(0);

    			bcrypt.compare(password,result.password,function(err,inMatch){
    				should.not.exist(err);
    				isMatch.should.equal(true);
    				user.remove(result._id,function(err){
    					should.not.exist(err);
    					done();
    				});
    			});
    		});
    	});
      
      

    });
	});
});