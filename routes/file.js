var express=require('express');
var router=express.Router();
const fs = require('fs');
router.get('/',function(req,res){
	fs.readFile('./txt/news.txt', 'utf8', function (err,data) {
  	if (err) {
  		res.end();
    	return console.log(err);
  		}
  	var url=JSON.parse(data);
  	var list=''
  	for(var i in url){
  		list+='<a href="'+url[i]+'">LINK'+i+'</a><br>';
  	}
  	res.send(list);
	});
})


module.exports=router;