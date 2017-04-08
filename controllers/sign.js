// 配置接口信息

//引入eventproxy模块
var eventproxy = require('eventproxy');

//引入数据模型
var UserModel = require('../models/user');


//显示注册页面
exports.showSignup = function(req,res){
    res.render('sign/signup');
};

//注册部分验证
exports.signup = function(req,res){

    //获取用户数据
    var username = req.body.loginname;
    var pass = req.body.pass;
    var re_pass = req.body.re_pass;
    var email = req.body.email;

    //实例化eventproxy对象
    var ep = new eventproxy();
    console.log(ep);
    //对注册错误信息进行处理
    ep.on('info_error',function(msg){
        res.status(422);  //返回错误信息
        res.render('sign/signup',{error:msg});  //同时返回注册页面
    });

    //校验数据
    //1、判断数据是否是空
    var hasEmptyInfo = [username,pass,re_pass,email].some(function(item){
        return item ==='';
    });
    //判断密码是否一致
    var isPassDiff = pass !== re_pass;

    //2、如果有空的信息或者密码不一致，不允许用户注册
    if(hasEmptyInfo||isPassDiff){
        ep.emit('info_error','注册信息错误');
        return;
    }
    
    //注册成功，保存到数据库
    UserModel.getUserBySignupInfo(username,email,function(err,users){
        if(err){
            ep.emit('info_error','获取用户数据失败！');
            return;
        }
        if(users.length>0){
            ep.emit('info_error','用户名或邮箱被占用!');
            return;
        }
        UserModel.addUser({username:username,pass:pass,email:email},function(err,result){
            if(result){
                res.render('sign/signup',{success:"恭喜你，注册成功"});
            }else{
                ep.emit('info_error',"注册失败！");
            }
        })
    });
};


exports.showSignin = function(req,res){
    res.render('sign/signin');
};

//登录部分验证
exports.signin = function(req,res){
    //获取用户信息
    var username = req.body.name;
    var pass = req.body.pass;
    
    if(!username||!pass){
        res.status(422);
        return res.render('sign/signin',{error:'您填写的信息不完整'});
    }
    UserModel.getUser(username,pass,function(err,user){
        if(user){
            //用户登录成功，将用户信息存储在session变量user中；
            //session需要在app.js中配置才能使用
            req.session.user = user;
            res.render('sign/signin',{success:'登录成功'});  //同时提醒用户登录成功
        }else{
            res.status(422);
            res.render('sign/signin',{error:'用户名或密码错误'});
        }
    })
};

exports.signout = function(req,res){
    req.session.destroy();  //销毁session
    res.redirect('/');  //跳转到首页
};