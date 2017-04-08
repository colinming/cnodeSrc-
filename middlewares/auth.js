/*
用于处理一些中间件
 */ 
exports.requireLogin = function(req,res,next){
    //判断用户是否登录，登录之后才能进行下一步,
    //否则发送402状态码，表示没有权限
    //最后跳转到登录页面
    if(req.session.user){
        return next();
    }
    res.status(402);
    res.redirect('/signin');
}