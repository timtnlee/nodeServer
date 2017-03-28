var express=require('express');
var router=express.Router();
const fs = require('fs');
router.get('/',function(req,res){
	fs.readFile('./txt/news.txt', 'utf8', function (err,data) {
  	if (err) {
  		res.end();
    	return console.log(err);
  		}
  	res.send(data);
	});
})


module.exports=router;