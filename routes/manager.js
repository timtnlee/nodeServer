require('../lib/db');
var express=require('express');
var mongoose=require('mongoose');
var router=express.Router();

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');
var MapArticles=mongoose.model('MapArticles');

router.get('/article',function(req,res){
	Articles.aggregate({$project:{Username:1,Title:1,Date:1,Popular:1}},function(err,article){
		res.render('article',{article:article})
		res.end()
	})
})

module.exports=router;