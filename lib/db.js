var mongoose=require('mongoose');

var Users_Schema=mongoose.Schema({
	Username:String,
	Password:String,
	UsersData:Object
})
var UsersData_Schema=mongoose.Schema({
	Username:String,
	// UsericonSet:{type:Boolean, default: false},
	Usericon:String,
	UsericonRatio:Number,
	Articles:Array,
	MapArticles:Array,
	Schedules:Array
	// [{
	// 	Title:String,
	// 	Places:Array,
	// 	Mode:Array
	// }]
})

var Articles_Schema=mongoose.Schema({
	Username:String,
	Title:String,
	Article:String,
	Date:Date,
	Popular:Number
})

var MapArticles_Schema=mongoose.Schema({
	Username:String,
	Title:String,
	Date:String,
	Places:Array,
	Articles:Array,
	Popular:Number
})
var Schedule_Schema=mongoose.Schema({
	Username:String,
	Title:String,
	Schedule:String
})

mongoose.model('Users',Users_Schema,'Users');
mongoose.model('UsersData',UsersData_Schema,'UsersData');
mongoose.model('Articles',Articles_Schema,'Articles');
mongoose.model('MapArticles',MapArticles_Schema,'MapArticles');
mongoose.model('Schedule',Schedule_Schema,'Schedule');
mongoose.connect('mongodb://127.0.0.1:27017/blog');
console.log('connect to DB');

var Users=mongoose.model('Users');
var UsersData=mongoose.model('UsersData');
var Articles=mongoose.model('Articles');
var MapArticles=mongoose.model('MapArticles');
//Copy_Key_From_A_to_B(MapArticles,UsersData)
//_pushData()

function _pushData(){
	MapArticles.update({},{$set:{Popular:0}},{multi:true},function(err,num){
		console.log(num)
	})
}

function Copy_Key_From_A_to_B(A_Collection,B_Collection){//multi to one
	A_Collection.find({},function(err,doc){
	for(var i in doc){
		var id=doc[i]._id,
			name=doc[i].Username;
		PushId(id,name)	
	}
	function PushId(id,name){console.log(id)
		B_Collection.update({Username:name},
			{ $push: {MapArticles: id}}
				, function(err,num){
				console.log(num);
				(err)?console.log(err):console.log('更改成功');
				});
		}
	})
}




 
