/*
路由文件的编写，需要在app.js里面配置才能使用
 */ 

var express = require('express');
var router = express.Router();

var signController = require('../controllers/sign');

var topicController = require('../controllers/topic');

var siteController = require('../controllers/site');

var replyController = require('../controllers/reply');

var auth = require('../middlewares/auth');


//显示注册页面
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
router.get('/topic/create',auth.requireLogin,topicController.showCreate);

//处理用户提交的话题信息
router.post('/topic/create',auth.requireLogin,topicController.create);


/***列表页路由***/
router.get('/',siteController.index);


/**详情页路由**/ 
router.get('/topic/:tid',topicController.detail);


//评论部分路由
router.post('/reply/reply',auth.requireLogin,replyController.addReply);

//处理评论图片上传
router.post('/upload',auth.requireLogin,replyController.upload);

module.exports = router;
