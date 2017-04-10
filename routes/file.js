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
  	res.send(url[2]);
	});
})


module.exports=router;