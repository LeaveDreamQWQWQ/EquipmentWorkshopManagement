// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
function formatTime(date) {
    date = date || new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
    
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
}
// 云函数入口函数
exports.main = async (event, context) => {
  const equipment = cloud.database().collection("equipment")
  const present=cloud.database().collection("present")
  const waiting = cloud.database().collection("waiting")
  const _ = cloud.database().command
  var now = formatTime(new Date(Date.now() + 8 * 60 * 60 * 1000))
  try {
    //查询数据--waiting
    var end = await waiting.where({
      startTime: _.lte(now),
      finishTime: _.gt(now)
    }).get({})
    //如果有已经开始的设备
    if (end.data.length != 0) {
      var namelist=[]
      //对于所有要更新的设备
      for(var i in end.data){
        var name = end.data[i].name
        var stuName=end.data[i].stuName
        var stuid=end.data[i].stuid
        var startTime=end.data[i].startTime
        var finishTime=end.data[i].finishTime
        var duration=end.data[i].duration
        var id=end.data[i]._id
        var _openid=end.data[i]._openid
        namelist.push(name)
        //1. 修改数据--equipment--设备状态改为2（使用中）
        await equipment.where({
          name: name
        }).update({
          data: {
            state: 2
          }
        })
        //2. waiting 删除数据
        await waiting.doc(id).remove({})
        //3. present 添加数据
        await present.add({
          data: {
            name: name,
            stuName: stuName,
            stuid:stuid,
            startTime: startTime,
            duration: duration,
            finishTime: finishTime,
            _openid:_openid
          }
        })
      }
      
      return {
        namelist
      }
    } 
    //如果不更新
    else {
      return {
        end
      }
    }
  } catch (e) {
    return {
      me: "wrong"
    }
  }
}