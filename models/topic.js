/*
    存储发表话题的数据文件
*/


var mongoose = require('../mongoose_helper').mongoose;


//定义集合字段
var TopicSchema = new mongoose.Schema({
    title:String,
    content:String,
    tab:String,
    username:String,  
    insertTime:Date
});

//添加数据模型方法
TopicSchema.statics.addTopic = function(topic,callback){  
    this.create(topic,callback);
};


// 三个参数：query 查询条件  option 配置项  回调函数
TopicSchema.statics.getTopics = function(query,option,callback){  

    this.find(query,{},option,callback);

};

//详情页数据方法
TopicSchema.statics.getTopic = function(topicId,callback){
  
    this.findOne({_id:topicId},callback);
};



//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('Topic',TopicSchema);

