require('../lib/db');
var express=require('express');
var mongoose=require('mongoose');
var router=express.Router();

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');
var Schedule=mongoose.model('Schedule');
//v3

router.post('/login',function(req,res){
	var name=req.body.name,
		passwd=req.body.passwd;
	Users.findOne({Username:name,Password:passwd},function(err,user){
			if(user!=null){
				console.log(name+' just login!');
				res.send({
						welcome:'歡迎!'+name,
						name:name,
						id:user._id,
						verification:'yes'});
			}
			else{
				console.log('user not found');
				res.send({
						welcome:'帳號或密碼錯誤',
						verification:'no'});
			}
		})		
	})
router.post('/register',function(req,res){
	var name=req.body.name,
		passwd=req.body.passwd;
	var newUserData=new UsersData({Username:name});
	Users.findOne({Username:name},function(err,name){
		if(name)res.end('重複名稱')
		else{
			newUserData.save(function(err,data){
			(err)?console.log(err):console.log('new users data');
			var data_id=data._id;
			saveUser(data_id)
			})
		}
	})
	
	
	function saveUser(id){
		var newUser=new Users({Username:name,Password:passwd,UsersData:id});
		newUser.save(function(err){
			console.log('關聯完成');
		(err)?res.send(err):res.send('註冊成功');
		})
	}
	
})
router.post('/personal',function(req,res){
	var userdata={};
		userdata.name=req.body.name;
	var findData=function(){
		return new Promise(function(resolve,reject){
			UsersData.findOne({Username:userdata.name},function(err,user){
				userdata.icon='img/icon.png';
				if(user.Usericon)userdata.icon=user.Usericon
				resolve()
			})
		})
	},
		findArticle=function(){
			return new Promise(function(resolve,reject){
				Articles.find({Username:userdata.name},function(err,articles){
					userdata.articles=articles;
					resolve()
				})	
			})
		},
		findSchedule=function(){
			return new Promise(function(resolve,reject){
				Schedule.find({Username:userdata.name},function(err,datas){
					userdata.schedules=datas;
					resolve()		
				})		
			})
		}
		Promise.all([findData(),findSchedule(),findArticle()]).then(()=>{
			res.send(userdata);	
		})	
})
router.post('/users',function(req,res){
	UsersData.aggregate({$project:{Username:1,Usericon:1}},function(err,user){
			res.send(user);
	})
})
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
router.post('/saveSchedule',function(req,res){
	let schedule=req.body.schedule,
		name=req.body.name,
		title=req.body.title,
		newSchedule=new Schedule({
			Username:name,
			Title:title,
			Schedule:schedule
		})
		newSchedule.save(function(err,con) {
			if(err)res.send('儲存失敗')
			else res.send('儲存成功')
		})	
})
router.post('/saveRouting',function(req,res){
	var title,
		place=[],
		mode=[],
		sch_id,
		name=req.body.name;
	for(var length in req.body){}
	for(var i in req.body){
		if(i==0)
		title=req.body[i]
		else{
			if(i%2==0)
				mode.push(req.body[i])
			else if(i!=length)
				place.push(req.body[i])
		}
	}
	console.log(place);
	var newSchedule=new Schedule({
		Username:name,
		Title:title,
		Places:place,
		Modes:mode
	})
	newSchedule.save(function(err,sch){
		if(!err){
			sch_id=sch._id;
			console.log(sch_id)
			console.log(name)
			UsersData.update({Username:name},{$push:{Schedules:sch_id}},function(err,data){
				(err)?res.send('發生錯誤'):res.send('儲存成功');
			})			
		}
		else
		res.send('發生錯誤')
	})	
})
//v2


router.post('/picture',function(req,res){
	var username=req.body.username;
	//var ratio=req.body.ratio;
	var data={};
	console.log('update userIcon');
	//var userData=new UsersData({Username:username,UsericonSet})
	data.pic=req.body.result;
	UsersData.update({Username:username},{ $set:
		 {Usericon:data.pic
		 	//,UsericonRatio:ratio
		 }}
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