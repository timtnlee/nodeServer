require('../lib/db');
var express=require('express');
var mongoose=require('mongoose');
var router=express.Router();

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');

router.post('/addArticle',function(req,res){
	var name=req.body.username,
		title=req.body.title,
		article=req.body.article,
		date=req.body.date;
	var newArticle=new Articles({
		Username:name,
		Title:title,
		Article:article,
		Date:date});
	newArticle.save(function(err){
		(err)?res.send(err):res.send('發表成功');
	})
})

router.post('/',function(req,res){
	console.log('article send..');
	var buf=new Buffer('hello');
	console.log(buf.toString());
	var data=[];
	UsersData.find({},function(err,user){
		console.log('find UsersData');
		data[0]=user;
		Articles.find({},function(err,doc){
		data[1]=doc;
			if(req.body.name=='')res.send(data);		
			else{
				console.log(req.body.name);
				UsersData.findOne({Username:req.body.name},function(err,icon){
					if(icon)data[2]=icon.Usericon;
					res.send(data);	
				})
			}
		})
	})
})

module.exports=router;