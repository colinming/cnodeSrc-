/*
专门用于连接mongodb数据库
 */ 
var mongoose = require('mongoose'); //第三方库用于操作mongodb

//连接数据库,数据库名node_club
mongoose.connect('mongodb://127.0.0.1/node_club'); 

exports.mongoose = mongoose;