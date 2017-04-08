/*
路由文件的编写，需要在app.js里面配置才能使用
 */ 
var express = require('express');
var router = express.Router();

//引入登录注册控制器文件
var signController = require('../controllers/sign');

//引入发表话题控制住器
var topicController = require('../controllers/topic');

//引入列表页控制器
var siteController = require('../controllers/site');

//引用评论控制器
var replyController = require('../controllers/reply');


//引入中间件文件，用于处理用户是否登录
var auth = require('../middlewares/auth');


//显示注册页面
//将回调函数交给控制器处理
router.get('/signup',signController.showSignup);

//提交注册信息
router.post('/signup',signController.signup);

//显示登录页面
router.get('/signin',signController.showSignin);

//提交登录信息
router.post('/signin',signController.signin);

//退出登录页面
router.get('/signout',signController.signout);


/****发表话题部分路由****/
//显示发表话题页面
//在回调函数之前，先用auth.requireLogin判断是否登录
router.get('/topic/create',auth.requireLogin,topicController.showCreate);

//处理用户提交的话题信息
router.post('/topic/create',auth.requireLogin,topicController.create);


/***列表页路由***/
//使用控制器里的index方法
router.get('/',siteController.index);


/**详情页路由**/ 
router.get('/topic/:tid',topicController.detail);


//评论部分路由
//处理评论提交, requireLogin表示需要是登录状态
router.post('/reply/reply',auth.requireLogin,replyController.addReply);

//处理评论图片上传
router.post('/upload',auth.requireLogin,replyController.upload);

module.exports = router;
