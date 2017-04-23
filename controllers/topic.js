/*
用于对发表话题页面的控制
 */ 


var validator = require('validator');

var eventproxy = require('eventproxy');

var timeHelper = require('../time_helper');

var TopicModel = require('../models/topic');

var ReplyModel = require('../models/reply');

var lodash = require('lodash');

exports.showCreate = function(req,res){
    res.render('topic/create');
};

//将用户发表的话题信息数据取出
exports.create = function(req,res){
    
    var title = validator.trim(req.body.title); //取title
    var tab = validator.trim(req.body.tab);
    var content = validator.trim(req.body.t_content);
    
    //校验空字符串
    var hasEmptyInfo = [title,tab,content].some(function(item){
        return item==='';
    });
    if(hasEmptyInfo){
        res.status(422);
        return res.render('topic/create',{error:"您填写的信息有错误"});
    };
    //符合要求的信息保存到数据库
    var topicData = {
        title:title,
        content:content,
        tab:tab,  
        username:req.session.user.username,  
        insertTime:Date.now() 
    };
    TopicModel.addTopic(topicData,function(error,result){
        return res.render('topic/create',{success:"发表话题成功"});
    });
    
};


/*******详情页空控制器方法*****/
exports.detail = function(req,res){
   
    var topicId = req.params.tid;

    var ep = new eventproxy();

    //从数据库获取话题详细数据
    TopicModel.getTopic(topicId,function(err,topic){

        topic.timeStr = timeHelper.formatTime(topic.insertTime);

        ep.emit('topic_data_ok',topic);
    });

    ReplyModel.count({topicId:topicId},function(err,count){
        ep.emit("reply_count_ok",count);
    });

    //获取评论的信息
    ReplyModel.getReplys(topicId,function(err,replys){
       
        replys = lodash.map(replys,function(reply){
            reply.timeStr = timeHelper.formatTime(reply.insertTime);
            return reply;
        });

        ep.emit('replys_data_ok',replys);
        
    });

    //处理话题信息
    ep.all('topic_data_ok','reply_count_ok','replys_data_ok',function(topic,count,replys){

        res.render('topic/detail',{topic:topic,count:count,replys:replys});
    });
} 