var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var engine = require('ejs-mate');

var webRouter = require('./routes/web_router');

var config = require('./config');

var session = require('express-session');

var RedisStore = require('connect-redis')(session);

var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();

var busboy = require('connect-busboy');

var app = express();

app.engine('html',engine);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public',express.static(path.join(__dirname, 'public')));

//使用session
app.use(session({
    secret:'dsfergdhfgj',  //对session进行加密
    store:new RedisStore({  //session储存在redis中,配置redis
        port:6379,
        host:'127.0.0.1'
    }),
    resave:true,
    saveUninitialized:true
}))

app.use(busboy());


//登出效果
app.use(function(req,res,next){
    app.locals.current_user = req.session.user; //将session里面的user数据赋给current_user
    next();
});


//利用locals传递配置文件
app.locals.config = config;
//传递markdown对象，在detail.html中使用
app.locals.md = md;

app.use('/',webRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen(3000);
