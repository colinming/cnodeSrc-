
/**列表页的控制器文件**/

var topicModel = require('../models/topic');

var lodash = require('lodash');

var timeHelper = require('../time_helper');

var eventproxy = require('eventproxy');

var ep = new eventproxy();

//查看主页的请求
exports.index = function(req,res){
    
    var page = parseInt(req.query.page) || 1;
    // console.log(req.query);
    page = page > 0 ? page : 1;

    var tab = req.query.tab || 'all';

    //创建mongodb查询信息
    var query = {};

    if(tab!=='all'){
        query.tab = tab;
    }
    var count = 10; 
    var option = {skip:(page-1)*count,limit:count,sort:'-insertTime'};

    topicModel.getTopics(query,option,function(err,topics){

        topics = lodash.map(topics,function(topic){
            topic.timeStr = timeHelper.formatTime(topic.insertTime);
            return topic;
        });

        ep.emit('topic_data_ok',topics);

    });

    topicModel.count(query,function(err,allCount){

        var pageCount = Math.ceil(allCount/count);
        ep.emit('page_count_ok',pageCount);

    });

    ep.all('topic_data_ok','page_count_ok',function(topics,pageCount){
        res.render('index',{topics:topics,tab:tab,page:page,pageCount:pageCount});
    })

}