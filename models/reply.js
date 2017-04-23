
// 评论数据模型


var mongoose = require('../mongoose_helper').mongoose;


//定义集合字段
var ReplySchema = new mongoose.Schema({
    topicId:String,
    content:String,
    username:String,
    insertTime:Date
});


ReplySchema.statics.addReply = function(reply,callback){
    this.create(reply,callback);
};

ReplySchema.statics.getReplys = function(topicId,callback){
    this.find({topicId:topicId},callback);
};


//导出数据模型,model-->mongoose方法
//User --> 数据模型名字
module.exports = mongoose.model('Reply',ReplySchema);

