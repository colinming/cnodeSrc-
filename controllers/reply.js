
/**用户评论的控制器**/

var path = require('path');

var fs = require('fs');

var ReplyModel = require('../models/reply');

// 提交评论
exports.addReply = function(req,res){

    var topicId = req.body.topicId;
    var content = req.body.t_content;
    var username = req.session.user.username;

    //通过数据模型ReplyModel,保存到mongodb数据库
    ReplyModel.addReply({
        topicId:topicId,
        content:content,
        username:username,
        insertTime:Date.now()
    },function(err,result){
        res.redirect('/topic/'+topicId);

        console.log(result);

    });


};


//上传文件
exports.upload = function(req,res){

    req.pipe(req.busboy);

    req.busboy.on('file',function(fieldname,file,filename,encoding,mimetype){

        var newFilename = String((new Date()).getTime()) + path.extname(filename);

        var filePath = __dirname + '/../public/upload/' + newFilename;

        var url = '/public/upload' + newFilename;

        file.pipe(fs.createWriteStream(filePath));

        file.on('end',function(){
            res.json({success:true,url:url});
        });

    });

};