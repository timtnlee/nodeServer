require('../lib/db');
var express=require('express');
var mongoose=require('mongoose');
var router=express.Router();

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');
var MapArticles=mongoose.model('MapArticles');
//v3
router.post('/article',function(req,res){
	Articles.find({},function(err,article){
		res.send(article);
	})
})
router.post('/single_article',function(req,res){
	console.log(req.body.id);
	Articles.find({_id:req.body.id},function(err,article){
		res.send(article);
	})
})	
router.post('/mapArticle',function(req,res){
	MapArticles.aggregate({$project:{Username:1,Title:1,Date:1}},function(err,article){
		res.send(article);
	})
})
router.post('/single_mapArticle',function(req,res){
	MapArticles.findOne({Username:req.body.name,Date:req.body.date},function(err,article){
		res.send(article);
	})
})
//v2
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
	newArticle.save(function(err,article){
		(err)?res.send(err):res.send('發表成功');
		var id=article._id;
		updateArticle(id)
	})
	function updateArticle(id){
		UsersData.update({Username:name},{$push:{Articles:id}},function(err){
			console.log('關聯完成');
		})
	}
})

router.post('/',function(req,res){
	console.log('article send..');
	var name=req.body.name;
	var data=[];
	UsersData.find({},function(err,user){
		console.log('find UsersData');
		data[0]=user;
		MapArticles.find({},function(err,map){
			//MapArticle data send
			console.log(map);
			Articles.find({},function(err,doc){
				data[1]=doc;
				if(name==''){
					console.log('guest');
					res.send(data);}		
				else{
					console.log(name);
					UsersData.findOne({Username:name},function(err,icon){
						console.log(icon.UsericonSet);
						if(icon.UsericonSet){
							data[2]={pic:icon.Usericon,ratio:icon.UsericonRatio};
							res.send(data);	}
						else{
							res.send(data);	
						}
					})
				}
			})
		})	
	})
})

router.post('/newMapArticle',function(req,res){
	console.log('newMapArticle...');
	var places=[],
	articles=[];

	for(var length in req.body);
		console.log(length);
	var title=req.body[0],
	date=req.body[1],
	name=req.body[2];
	for(var i=3;i<=length;i+=2){
		places.push(req.body[i]);
	}
	for(var i=4;i<=length;i+=2){
		articles.push(req.body[i]);
	}
	console.log(articles.length);
	console.log(articles);
	var newMapArticle=new MapArticles({
		Username:name,
		Title:title,
		Date:date,
		Places:places,
		Articles:articles
	})
	newMapArticle.save(function(err,article){
		console.log('MapArticle Saved!!');
		var id=article._id;
			UsersData.update({Username:name},
			{ $push: {MapArticles: id}}
				, function(err,num){
				//console.log(num);
				(err)?console.log(err):console.log('關聯成功');
				});
	})
	console.log(places);
	res.send('儲存成功');
})
module.exports=router;