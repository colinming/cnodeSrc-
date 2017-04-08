/*
    获取用户数据的数据文件
*/

//引入mongoose专用连接数据库文件
var mongoose = require('../mongoose_helper').mongoose;

//定义集合字段
var UserSchema = new mongoose.Schema({
    username:String,  //定义数据类型
    pass:String,
    email:String
});

//添加数据模型方法
UserSchema.statics.getUserBySignupInfo = function(username,email,callback){
    //设置查询条件
    var cond = ['$or',{username:username},{email:email}];
    //利用mongoose的find方法，实现查询
    this.find(cond,callback);
};
UserSchema.statics.addUser = function(user,callback){  //注意这里的参数，只需两个参数
    this.create(user,callback);
};
UserSchema.statics.getUser = function(username,pass,callback){
    this.findOne({username:username,pass:pass},callback);
};

//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('User',UserSchema);

