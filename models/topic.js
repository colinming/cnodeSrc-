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


// 三个参数：query 查询条件  option 配置项  回调函数
TopicSchema.statics.getTopics = function(query,option,callback){  

    //从mongodb取数据
    this.find(query,{},option,callback);

};

//详情页数据方法
TopicSchema.statics.getTopic = function(topicId,callback){
    //只需要查询一个话题信息，用mongodb的findOne方法
    this.findOne({_id:topicId},callback);
};



//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('Topic',TopicSchema);

