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

  const wxContext = cloud.getWXContext()
  const equipment = cloud.database().collection("equipment")
  const present = cloud.database().collection("present")
  const waiting = cloud.database().collection("waiting")
  const past = cloud.database().collection("past")
  const _ = cloud.database().command
  var now = formatTime(new Date(Date.now() + 8 * 60 * 60 * 1000))
  try {
    //查询数据--present
    var end = await present.where({
      finishTime: _.lte(now)
    }).get({})
    if (end.data.length != 0) {
      for (var i in end.data) {
        var name = end.data[i].name
        var stuName = end.data[i].stuName
        var startTime = end.data[i].startTime
        var finishTime = end.data[i].finishTime
        var duration = end.data[i].duration
        var id = end.data[i]._id
        //添加数据--past
        await past.add({
          data: {
            name: name,
            stuName: stuName,
            startTime: startTime,
            duration: duration,
            finishTime: finishTime
          }
        })
        //删除数据--present
        await present.doc(id).remove({})
        //修改数据--equipment
        await equipment.where({
          name: name
        }).update({
          data: {
            state: 1
          }
        })
      }
    }
    var wait = await waiting.where({
      finishTime: _.lte(now)
    }).get({})
    if (wait.data.length != 0) {
      for (var i in wait.data) {
        var name = wait.data[i].name
        var stuName = wait.data[i].stuName
        var startTime = wait.data[i].startTime
        var finishTime = wait.data[i].finishTime
        var duration = wait.data[i].duration
        var id = wait.data[i]._id
        //添加数据--past
        await past.add({
          data: {
            name: name,
            stuName: stuName,
            startTime: startTime,
            duration: duration,
            finishTime: finishTime
          }
        })
        //删除数据--present
        await waiting.doc(id).remove({})
      }
    }
    return {
      namelist
    }
  } catch (e) {
    return {
      me: "wrong"
    }
  }

}