var express=require('express');
var path=require('path');
var cookieParser=require('cookie-parser');
var cookieSession=require('cookie-session');
var bodyParser=require('body-parser');
//導入自己設定的Router
var index=require('./routes/index');
var user=require('./routes/user');
var article=require('./routes/article');
var file=require('./routes/file');
//var post=require('./routes/post');
var app=express();
//Cross domain
var reqCount=0;
app.use(function(req,res,next){
	reqCount++;
	if(req)console.log('Client Request'+reqCount);
	next();
})
app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
 	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
 	//res.header('Access-Control-Allow-Headers','Content-Type');
 	next();
})

//模板
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//靜態檔案路徑
app.use(express.static(path.join(__dirname,'public')));
//bodyparser(為了post method)
app.use(bodyParser.urlencoded({
	limit:52428800,
	extended:false
}));

//啟用cookie
app.use(cookieParser());
app.use(cookieSession({
	secret:'hello'
}))
//啟用自己設定的Router中介
app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.use('/file',file);
//app.use('/post',post);

app.listen(3000);
console.log('Server started'); 