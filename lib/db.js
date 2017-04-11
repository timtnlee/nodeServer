var mongoose=require('mongoose');

var Users_Schema=mongoose.Schema({
	//UserId:String,
	Username:String,
	Password:String
})
var UsersData_Schema=mongoose.Schema({
	Username:String,
	UsericonSet:{type:Boolean, default: false},
	Usericon:String,
	UsericonRatio:Number
})

var Articles_Schema=mongoose.Schema({
	Username:String,
	Title:String,
	Article:String,
	Date:Date
})

var MapArticles_Schema=mongoose.Schema({
	Username:String,
	Title:String,
	Date:String,
	Places:Array,
	Articles:Array
})

mongoose.model('Users',Users_Schema,'Users');
mongoose.model('UsersData',UsersData_Schema,'UsersData');
mongoose.model('Articles',Articles_Schema,'Articles');
mongoose.model('MapArticles',MapArticles_Schema,'MapArticles');
mongoose.connect('mongodb://127.0.0.1:27017/blog');
console.log('connect to DB');


 
