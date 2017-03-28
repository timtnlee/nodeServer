var express=require('express');
var router=express.Router();


router.get('/',function(req,res){
	console.log('connecting...');
	if(req.session.logined){
		res.render('index',{username:','+req.session.name});
		res.end();
	}
	else
	res.render('index',{username:''});
	res.end();
})


//test for phonegap response 
router.post('/t',function(req,res){
	if(req.body.name){
		var name=req.body.name;
		console.log(name);
		res.end(name);
	}
	else
		res.end();
})

module.exports=router;