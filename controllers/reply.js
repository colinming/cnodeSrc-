
/**用户评论的控制器**/

var path = require('path');

var fs = require('fs');

//引入评论数据模型
var ReplyModel = require('../models/reply');

// 提交评论
exports.addReply = function(req,res){

    //获取数据信息字段
    //由于是psot方式提交，用req获取
    var topicId = req.body.topicId;
    var content = req.body.t_content;
    var username = req.session.user.username; //定义谁提交的评论

    //通过数据模型ReplyModel,保存到mongodb数据库
    ReplyModel.addReply({
        topicId:topicId,
        content:content,
        username:username,
        insertTime:Date.now() //评论加到数据库的时间
    },function(err,result){
        res.redirect('/topic/'+topicId); //返回到话题页面

        console.log(result);

    });


};


//上传文件
exports.upload = function(req,res){

    //借助第三方工具connect-busboy
    req.pipe(req.busboy);

    req.busboy.on('file',function(fieldname,file,filename,encoding,mimetype){

        //新文件名
        var newFilename = String((new Date()).getTime()) + path.extname(filename);

        //新文件保存目录
        var filePath = __dirname + '/../public/upload/' + newFilename;

        var url = '/public/upload' + newFilename;

        file.pipe(fs.createWriteStream(filePath));

        file.on('end',function(){
            res.json({success:true,url:url});
        });

    });

};