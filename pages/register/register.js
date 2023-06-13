//获取时间信息
var util = require('../../utils/util');
//获取全局数据，确定在设备页面选中的设备
const app=getApp();
//获得记录文件，添加预约的数据
const present=wx.cloud.database().collection("present")
const e=wx.cloud.database().collection("equipment")
const waiting=wx.cloud.database().collection("waiting")

Page({
  data: {
    //前一页面选中的设备
    selectedEqu:"",
    selectedEquID:"",
    selectedEquClass:"",
    //要提交的信息
    name:"",
    stuName:"",
    stuid:"",
    startTime:"",
    finishTime:"",
    duration:0,
    //要获取的信息
    h:0,//使用时长
    min:0,
    time:'',//预约功能数据：开始时间
    startDate:null,//预约功能数据：开始时间(日期对象)
    //劳保清单，比较简单，直接在文件中写吧
    labor:"",
    hIsNaN:true,
    minIsNaN:true,
    book:false,
    list:[
        {
          name:"激光切割机",
          l:"防护眼镜"
        },
        {
          name:"铣床",
          l:"防护面罩，降噪耳机"
        },
        {
          name:"数控雕刻机",
          l:"防护面罩，降噪耳机"
        },
        {
          name:"斜切锯",
          l:"防护面罩，降噪耳机，口罩"
        },
        {
          name:"角磨机",
          l:"防护面罩，降噪耳机，口罩"
        },
        {
          name:"沙盘砂带机",
          l:"防护面罩，口罩"
        },
        {
          name:"台锯",
          l:"防护面罩，降噪耳机，口罩"
        },
    ] ,
    waitingList:[],
    //图片
    imagePath:"../../icon/warning.png",
    disabled:false
  },
  
  //显示页面,获取name,stuName,现在的时间time以及劳保信息labor
  onShow() {
    let that=this
    var time='请选择时间'
    that.setData({
      selectedEqu:app.globalData.selectedEqu,
      selectedEquID:app.globalData.selectedEquID,
      selectedEquClass:app.globalData.selectedEquClass,
      stuName:app.globalData.stuName,
      stuid:app.globalData.stuid,
      labor:"",
      book:app.globalData.book,
      time:time,
    })
    that.getWaitingList()
    //设置劳保信息
    if(app.globalData.selectedEquClass!="3d18"){
      for (var i in that.data.list){ 
        if(that.data.list[i].name==that.data.selectedEqu){
          that.setData({
            labor:that.data.list[i].l
          })
          break
        }
      }
    }
    else{
      that.setData({
        labor:"无"
      })
    }
  },

  //获取输入小时(使用时长)
  hours(e){
    let that=this
    var hours=0
    let num=e.detail.value
    //如果不为正自然数，且不为空
    if(!(/(^[1-9]\d*$)/.test(num)&&(num))){
      if(num==0){
        that.setData({
          hIsNaN:true,
          h:hours
        })
      }
      else{
        that.setData({
          hIsNaN:false
        })
      }
    }
    else{
      if(num){
        hours=num
      }
      that.setData({
        h:hours
      })
    }
  },
  //获取输入分钟（使用时长）
  minutes(e){
    let that=this
    var minutes=0
    let num=e.detail.value
    //如果不为正自然数，且不为空
    if(!(/(^[1-9]\d*$)/.test(num)&&(num))){
      if(num==0){
        that.setData({
          minIsNaN:true,
          min:minutes
        })
      }
      else{
        that.setData({
          minIsNaN:false
        })
      }
    }
    else{
      if(num){
        minutes=num
      }
      that.setData({
        min:minutes
      })
    }
  },

  //获取预约列表
  getWaitingList() {
    let that = this
    var waitingList = []
    present.where({
      name: that.data.selectedEqu
    }).get()
    .then(presentRes => {
      if (presentRes.data.length != 0) {
        var startTime = presentRes.data[0].startTime
        var finishTime = presentRes.data[0].finishTime
        var obj = {
          startTime: startTime,
          finishTime: finishTime
        }
        waitingList.push(obj)
      }
    })
      .then((res => {
        waiting.where({
            name: that.data.selectedEqu
          }).get()
          .then(waitingRes => {
            for (var i in waitingRes.data) {
              var startTime = waitingRes.data[i].startTime
              var finishTime = waitingRes.data[i].finishTime
              var obj = {
                startTime: startTime,
                finishTime: finishTime
              }
              waitingList.push(obj)
            }
          })
          .then(res => {
            var compare = function (obj1, obj2) {
              var val1 = obj1.startTime;
              var val2 = obj2.finishTime;
              if (val1 < val2) {
                return -1;
              } else if (val1 > val2) {
                return 1;
              } else {
                return 0;
              }
            }
            waitingList = waitingList.sort(compare)
            for(var n in waitingList){
              waitingList[n].startTime=waitingList[n].startTime.substring(11,16)
              waitingList[n].finishTime=waitingList[n].finishTime.substring(11,16)
            }     
            that.setData({
              waitingList: waitingList
            })
          })
      }))
  },
  //预约功能：获取开始时间
  changeTime(e){
    let that=this
    //设置time，并在页面显示
    var time=e.detail.value
    //将time转变为Date对象--startDate
    const date=new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    let hour = Number(time.substring(0,2));
    let minute = Number(time.substring(3, 5));
    var startDate=new Date(year, month, day, hour, minute, 0, 0)
    //如果选择时间比现在还早，提示无效时间,且把startDate设置为null（这样就无法成功提交信息）
    if (startDate < new Date()) {
      wx.showToast({
        title: '无效预约时间',
        icon: 'error',
        duration: 1000
      })
      hour=date.getHours()
      minute=date.getMinutes()
      if (minute<10){
        minute="0"+minute
      }
      time=hour+':'+minute
      startDate=null
    }
    //如果选择时间与其他预约时间重合，提醒：忙碌
    that.judge(startDate).then(res=>{
      console.log(res)
      if(!res){
        wx.showToast({
          title: '设备在此时间忙碌',
          icon:'none',
          duration: 1000
        })
      }
      that.setData({
        time:time,
        startDate:startDate
      })
    })
  },
  //形成name,stuName,stuid,startTime,duration,finishTime
  getInfo() {
    let that = this
    that.setData({
      disabled:true
    })
    let hIsNaN = that.data.hIsNaN
    let minIsNaN = that.data.minIsNaN
    //1.获取name
    let name = that.data.selectedEqu
    //2.获取stuName、stuid
    let stuName = that.data.stuName
    let stuid=that.data.stuid
    //3.获取duration
    let h = Number(that.data.h)
    let min = Number(that.data.min)
    var duration =(60 * h + min)
    //4.获取startTime
    //4.1如果是预约程序
    if (that.data.book) {
      var startDate = that.data.startDate
    }
    //4.2如果是登记程序
    else {
      var startDate = new Date()
    }
    //如果没有正确填写信息，就提醒
    if (!name || !startDate || (!h && !min) || !hIsNaN || !minIsNaN) {
      that.setData({
        disabled:false
      })
      wx.showToast({
        title: '请正确填写',
        icon: 'error',
        duration: 1000
      })
      return;
    } 
    else {
      let startTime = util.formatTime(startDate)
      let startStamp = Date.parse(startDate)
      //5.获取finishTime
      let finishDate = new Date(startStamp + 60000 * min + 3600000 * h)
      let finishTime = util.formatTime(finishDate)
      //判断设备在这段时间是否空闲（如果是预约，可能会出现预约时段与其他预约时段重合的情况）
      that.judge(startDate).then(startRes => {
        that.judge(finishDate).then(finishRes => {
          //如果时间重合了，提醒一下
          if (!startRes || !finishRes) {
            that.setData({
              disabled:false
            })
            wx.showToast({
              title: '设备在此时间段忙碌',
              icon: 'none',
              duration: 1000
            })
          }
          //如果时间不重合，更新数据，并请用户确认预约
          else {
            that.setData({
              name: name,
              stuName: stuName,
              stuid:stuid,
              startTime: startTime,
              finishTime: finishTime,
              duration: duration,
            })
            that.comfirm()
          }
        })
      })
    }
  },
  comfirm(){
    let that=this
    wx.showModal({
      title:'确定提交',
      content:'您确定要提交吗？'
    }).then(res=>{
      e.where({name:that.data.selectedEqu}).get().then(re=>{
        if(res.confirm){
          if(re.data[0].state==1||that.data.book||app.globalData.force){
            if(app.globalData.force){
              app.EndUse(app.globalData.selectedEqu, 2)
            }
            setTimeout(()=>{
              wx.showToast({
                title: '提交成功',
                icon:"success",
                duration:1000
              })
            },1000)
            that.addData()
          }
          else{
            setTimeout(()=>{
              wx.showToast({
                title: '这台设备被抢了！',
                icon:"error",
                duration:1000
              })
            },1000)
            wx.switchTab({
              url: '/pages/Home/Home',
            }) 
          }
        }
        else{
          console.log("用户点击了取消")
        }
      }).then(res=>{
        that.setData({
          disabled:false
        })
      })
    })
  },
  addData(){
    let that=this
    if (!that.data.book) {
      present.add({
        data: {
          name: that.data.name,
          stuName: that.data.stuName,
          stuid:that.data.stuid,
          startTime: that.data.startTime,
          finishTime: that.data.finishTime,
          duration: that.data.duration
        },
        success:res=>{
          console.log("预约成功", res)
        }
      })
      e.where({
        name: that.data.name
      }).update({
        data: {
          state: 2
        }
      })
    }
    else{
      waiting.add({
        data: {
          name: that.data.name,
          stuName: that.data.stuName,
          stuid:that.data.stuid,
          startTime: that.data.startTime,
          finishTime: that.data.finishTime,
          duration: that.data.duration
        },
        success:res=> {
          console.log("预约成功", res)
        }
      })
    }
    
    wx.switchTab({
      url: '/pages/Home/Home',
    })
  },
  judge(date){
    return new Promise((resolve, reject) => {
      let that=this
      var time = util.formatTime(date)
      const _ = wx.cloud.database().command
      waiting.where({
        name:that.data.selectedEqu,
        startTime: _.lt(time),
        finishTime: _.gt(time)
      }).get().then(res => {
        if (res.data.length!=0) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
})