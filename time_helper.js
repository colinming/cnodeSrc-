/**处理时间转化的方法，
在controllers中的site.js与topic.js中都有用到，
抽取出来，实现复用**/


exports.formatTime = function(time){
    //引号加个空格，时间与日期隔开
    //replace用于去除时间后面的GM
    return time.toLocaleDateString() + ' ' + time.toTimeString().replace(/\sGM.*$/,'');

} 