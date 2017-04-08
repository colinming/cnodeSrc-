/*
    存储发表话题的数据文件
*/

//引入mongoose专用连接数据库文件
var mongoose = require('../mongoose_helper').mongoose;


//定义集合字段
var TopicSchema = new mongoose.Schema({
    title:String,
    content:String,
    tab:String,
    username:String,  //定义数据类型
    insertTime:Date
});

//添加数据模型方法
TopicSchema.statics.addTopic = function(topic,callback){  //注意这里的参数，只需两个参数
    this.create(topic,callback);
};


//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('Topic',TopicSchema);

