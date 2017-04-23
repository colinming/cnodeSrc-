/*
    获取用户数据的数据文件
*/


var mongoose = require('../mongoose_helper').mongoose;

//定义集合字段
var UserSchema = new mongoose.Schema({
    username:String,  
    pass:String,
    email:String
});

//添加数据模型方法
UserSchema.statics.getUserBySignupInfo = function(username,email,callback){
   
    var cond = ['$or',{username:username},{email:email}];
   
    this.find(cond,callback);
};
UserSchema.statics.addUser = function(user,callback){  
    this.create(user,callback);
};
UserSchema.statics.getUser = function(username,pass,callback){
    this.findOne({username:username,pass:pass},callback);
};

//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('User',UserSchema);

