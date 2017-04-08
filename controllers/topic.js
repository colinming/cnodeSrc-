/*
用于对发表话题页面的控制
 */ 

//引入validator
var validator = require('validator');

//发表话题页面数据模型
var TopicModel = require('../models/topic');


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