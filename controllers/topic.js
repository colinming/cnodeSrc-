/*
用于对发表话题页面的控制
 */ 

//引入validator
var validator = require('validator');

var eventproxy = require('eventproxy');

//引入事件格式函数
var timeHelper = require('../time_helper');

//发表话题页面数据模型
var TopicModel = require('../models/topic');

//引入评论数据模型
var ReplyModel = require('../models/reply');

var lodash = require('lodash');

/***两个方法**/
//显示发表话题页面
exports.showCreate = function(req,res){
    res.render('topic/create');
};

//将用户发表的话题信息数据取出
exports.create = function(req,res){
    
    //使用第三方工具validator校验取出的数据
    //使用validator的trim方法，剔除两端的空格
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
        tab:tab,  //版块
        username:req.session.user.username,  //用于名
        insertTime:Date.now()  //发表时间
    };
    TopicModel.addTopic(topicData,function(error,result){
        return res.render('topic/create',{success:"发表话题成功"});
    });
    
};


/*******详情页空控制器方法*****/
exports.detail = function(req,res){
    //拿到tid
    var topicId = req.params.tid;

    var ep = new eventproxy();

    //从数据库获取话题详细数据
    TopicModel.getTopic(topicId,function(err,topic){

        topic.timeStr = timeHelper.formatTime(topic.insertTime);

        ep.emit('topic_data_ok',topic);
    });

    //获取评论的数量
    ReplyModel.count({topicId:topicId},function(err,count){
        ep.emit("reply_count_ok",count);
    });

    //获取评论的信息
    ReplyModel.getReplys(topicId,function(err,replys){
        //对评论信息时间进行转换，lodash的map方法
        replys = lodash.map(replys,function(reply){
            reply.timeStr = timeHelper.formatTime(reply.insertTime);
            return reply;
        });

        //抛出时间，说明评论数据已经准备好了，并把评论数据抛出去
        ep.emit('replys_data_ok',replys);
        
    });

    //处理话题信息
    ep.all('topic_data_ok','reply_count_ok','replys_data_ok',function(topic,count,replys){
        //拿到话题信息数据，显示详情页,并且将话题信息传递给视图文件
        res.render('topic/detail',{topic:topic,count:count,replys:replys});
    });
} 