
/**列表页的控制器文件**/
//引入列表页数据文件 
var topicModel = require('../models/topic');

//用来转换时间的显示方式
var lodash = require('lodash');

//引入时间转化函数
var timeHelper = require('../time_helper');

var eventproxy = require('eventproxy');

var ep = new eventproxy();

//查看主页的请求
exports.index = function(req,res){
    //获取分页信息，转换为整数，如果没有page信息显示第一页
    var page = parseInt(req.query.page) || 1;
    // console.log(req.query);
    //判断得到的page是否大于0
    page = page > 0 ? page : 1;

    //获取版块信息
    var tab = req.query.tab || 'all';

    //创建mongodb查询信息
    var query = {};

    if(tab!=='all'){
        query.tab = tab;
    }
    var count = 10; //每页显示10条数据
    //设置查询选项
    //skip 查询数据时，根据需求跳过的数据
    //limit：数据条数
    //sort：倒叙排序
    var option = {skip:(page-1)*count,limit:count,sort:'-insertTime'};

    topicModel.getTopics(query,option,function(err,topics){

        //转化时间显示方式
        topics = lodash.map(topics,function(topic){
            topic.timeStr = timeHelper.formatTime(topic.insertTime);
            return topic;
        });

        ep.emit('topic_data_ok',topics);

        //从数据库获取的列表页数据
        // console.log(topics);

    });

    //mongoose的count方法
    topicModel.count(query,function(err,allCount){

        //页面总数
        var pageCount = Math.ceil(allCount/count);
        ep.emit('page_count_ok',pageCount);

    });

    //捕获两次事件
    ep.all('topic_data_ok','page_count_ok',function(topics,pageCount){
        res.render('index',{topics:topics,tab:tab,page:page,pageCount:pageCount});
    })

}