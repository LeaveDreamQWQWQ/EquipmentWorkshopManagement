// app.js
App({
  onLaunch() {
    //云开发环境初始化
    wx.cloud.init({
      env: ""//开发环境ID
    })

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  onShow() {
    this.getopenid()
  },

  globalData: {
    userInfo: null,
    //当前选择的设备的名称
    selectedEqu: null,
    //当前选择的设备的id
    selectedEquID: null,
    //是否为管理员
    power: false,
    //管理员邮箱
    PowerEmail: null,
    //当前选择的设备的class
    selectedEquClass: null,
    stuName: "",
    stuid: "",
    openid: "",
    signed: false,
    per3d: false,
    per3d9: false,
    perlaser: false,
    permill: false,
    percnc: false,
    pertools: false,
    perangle: false,
    //当前需要结束的设备的信息
    EquData: null,
    book: false,
    force: false
  },

  //强制结束-输入：需要结束的设备名称，需要改变成什么状态
  EndUse: function (EquName, state) {
    return new Promise((resolve, reject) => {
      var myDate = new Date()
      var util = require('utils/util')
      let that = this
      let presentdata = wx.cloud.database().collection("present")
      let pastdata = wx.cloud.database().collection("past")
      let equipment = wx.cloud.database().collection("equipment")
      console.log(EquName)
      //获取结束设备在present里的信息
      presentdata.where({
        name: EquName
      }).get().then(res => {
        that.globalData.EquData = res.data
        if (that.globalData.EquData.length != 0) {
          //删除present里的信息
          presentdata.doc(that.globalData.EquData[0]._id).remove({})
          //修改结束时间
          that.globalData.EquData[0].finishTime = util.formatTime(myDate)
          //使用时长
          var FinishDay = parseInt(myDate.getDate())
          var FinishHours = parseInt(myDate.getHours())
          var FinishMinutes = parseInt(myDate.getMinutes())
          var StartDay = parseInt(that.globalData.EquData[0].finishTime.substring(8, 10))
          var StartHours = parseInt(that.globalData.EquData[0].finishTime.substring(11, 13))
          var StartMinutes = parseInt(that.globalData.EquData[0].finishTime.substring(14, 16))
          var durationDay = 0
          var durationHours = 0
          var durationMinute = 0
          var duration = 0
          if (FinishDay > StartDay) {
            durationHours = 24 - StartHours + FinishHours
            durationDay = FinishDay - StartDay - 1
            if (StartMinutes > FinishMinutes) {
              durationMinute = 60 - StartMinutes + FinishMinutes
              durationHours = durationHours - 1
            } else {
              durationMinute = FinishMinutes - StartMinutes
            }
          } else {
            console.log(FinishHours)
            console.log(StartHours)
            durationHours = FinishHours - StartHours
            if (StartMinutes > FinishMinutes) {
              durationMinute = 60 - StartMinutes + FinishMinutes
              durationHours = durationHours - 1
            } else {
              durationMinute = FinishMinutes - StartMinutes
            }
          }
          duration = durationDay * 60 * 24 + durationHours * 60 + durationMinute
          that.globalData.EquData[0].duration = duration
          //past创建新的数据
          pastdata.add({
            data: {
              name: that.globalData.EquData[0].name,
              stuName: that.globalData.EquData[0].stuName,
              startTime: that.globalData.EquData[0].startTime,
              duration: that.globalData.EquData[0].duration,
              finishTime: that.globalData.EquData[0].finishTime,
            }
          }).then(res => {
            //改变state状态
            equipment.where({
              name: that.globalData.EquData[0].name
            }).update({
              data: {
                state: state
              }
            })
          })
        } else {
          //改变state状态
          equipment.where({
            name: EquName
          }).update({
            data: {
              state: state
            }
          })
        }
      }).then(res => {
        console.log("updata Equ")
        //刷新
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onShow()
        resolve()

        //提示完成使用 
        if (state == 1) {
          wx.showToast({
            title: '使用完成',
            duration: 2000, //停留时间
          })
        }
      })
    })
  },

  // 更换选中目标
  ChangeTarget(e) {
    return new Promise((resolve, reject) => {
      let equipment = wx.cloud.database().collection("equipment")
      equipment.where({
        name: e.detail[0]
      }).get().
      then(res => {
        var list = res.data[0]
        this.globalData.selectedEqu = list.name
        this.globalData.selectedEquID = list._id
        this.globalData.selectedEquClass = list.equipment_class
        resolve()
      })
    })
  },

  getopenid() {
    return new Promise((resolve, reject) => {
      let that = this
      wx.cloud.callFunction({
          name: "getopenid"
        })
        .then(res => {
          console.log("获取openid成功：", res.result.openid)
          that.globalData.openid = res.result.openid
          wx.cloud.database().collection('user').where({
              openid: res.result.openid
            }).get()
            .then(res => {
              if (res.data.length != 0) {
                console.log("该用户已经注册了", res.data[0].stuName, res.data[0].stuid)
                var a = res.data[0]
                that.globalData.signed = true
                that.globalData.stuName = a.stuName
                that.globalData.stuid = a.stuid
                that.globalData.per3d = a.per3d
                that.globalData.per3d9 = a.per3d9
                that.globalData.perangle = a.perangle
                that.globalData.percnc = a.percnc
                that.globalData.perlaser = a.perlaser
                that.globalData.permill = a.permill
                that.globalData.pertools = a.pertools
                that.globalData.power = a.power
              } else {
                console.log("该用户还没注册")
                that.globalData.signed = false,
                  that.globalData.stuid = "",
                  that.globalData.stuName = ""
              }
              resolve()
            })
        })
    })
  },
  setData() {
    return new Promise((resolve, reject) => {
      this.globalData.selectedEqu = null,
        this.globalData.selectedEquID = null,
        this.globalData.power = false,
        this.globalData.selectedEquClass = null,
        this.globalData.stuName = "",
        this.globalData.stuid = "",
        this.globalData.openid = "",
        this.globalData.signed = false,
        this.globalData.per3d = false,
        this.globalData.per3d9 = false,
        this.globalData.perlaser = false,
        this.globalData.permill = false,
        this.globalData.percnc = false,
        this.globalData.pertools = false,
        this.globalData.perangle = false,
        this.globalData.EquData = null
      resolve()
    })
  }
})