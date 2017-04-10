require('../lib/db');
var express=require('express');
var mongoose=require('mongoose');
var router=express.Router();

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');

router.post('/login',function(req,res){
	var name=req.body.name,
		passwd=req.body.passwd;
	Users.findOne({Username:name,Password:passwd},function(err,user){
			if(user!=null){
				console.log(name+' just login!');
				res.send({
						welcome:'歡迎!'+name,
						name:name,
						verification:true});
			}
			else{
				console.log('user not found');
				res.send({
						welcome:'帳號或密碼錯誤',
						verification:false});
			}
		})		
	})
//v3
router.post('/personal',function(req,res){
	console.log(req.body.name);
	UsersData.findOne({Username:req.body.name},function(err,user){
		if(user.UsericonSet==true)
			res.send({icon:user.Usericon});
		else
			res.end();
	})
})
router.post('/users',function(req,res){
	UsersData.find({},function(err,user){
			res.send(user);
	})
})

//v2
router.post('/nameCheck',function(req,res){
	var name=req.body.name;
	console.log('name check:'+name);
	Users.findOne({Username:name},function(err,user){
		if(user!=null){
			res.send('no');
		}
		else
			res.send('yes');
	})
})

router.post('/register',function(req,res){
	var name=req.body.name,
		passwd=req.body.passwd;
	var newUser=new Users({Username:name,Password:passwd});
	var newUserData=new UsersData({Username:name});
	
	newUserData.save(function(err){
		(err)?console.log(err):console.log('new users data');
	})

	newUser.save(function(err){
		(err)?res.send(err):res.send('註冊成功');
	})
	
})

router.post('/picture',function(req,res){
	var username=req.body.username;
	var ratio=req.body.ratio;
	var data={};
	console.log('update userIcon');
	//var userData=new UsersData({Username:username,UsericonSet})
	data.pic=req.body.result;
	UsersData.update({Username:username},{ $set: {UsericonSet:true,Usericon:data.pic,UsericonRatio:ratio}}
		, function(err,num){
		(err)?res.send(err):res.send('更改成功');
	});
	
})

router.post('/checkicon',function(req,res){
	var username=req.body.username;
	UsersData.findOne({Username:username},function(err,userdata){
		(userdata.UsericonSet==true)?res.send({usericon:userdata.Usericon}):res.end();
		
	})
})

router.post('/allUsers',function(req,res){
	UsersData.find({},function(err,users){
		res.write(users[0].Username);
		res.write(users[1].Username);
		res.end();
	});
			
})
router.post('/test',function(req,res){
	res.send('success!!');
})

router.get('/display',function(req,res){
	UsersData.find({},function(err,user){
		var count=user.length;
		var table='<table><tr><td>name</td><td>Icon</td></tr>';
		
		for(var i=0;i<count;i++){
			var pic=user[i].Usericon;
			table+='<tr><td>'+user[i].Username+'</td><td><img src="'+pic+'"></td></tr>';
				if(i==(count-1)){
				table+='</table>';
				res.end(table);
				}
			}		
	})
})


module.exports=router;