// pages/history/history.js
const equipment = wx.cloud.database().collection("equipment")
const present = wx.cloud.database().collection("present")
const past = wx.cloud.database().collection("past")
const waiting = wx.cloud.database().collection("waiting")
var myDate = new Date();
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //传入component的list
    history: [],
    CheckNum: true,
    PastNum: 0,
    WaitingNum: 0,
    PresentNum: 0,
  },


  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.CheckNum()
    if (this.data.CheckNum) {
      //加载框
      wx.showLoading({
        title: '加载中',
      })
      await this.GetList()
      //消除加载框
      wx.hideLoading({
        success: (res) => {
          console.log("消除成功")
        },
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow()
  },

  //获取prensent和past中的用户数据,传入云数据库和需要添加的状态——1为已经完成、2未完成、3未开始
  async GetList(e) {
    let that = this
    //初始化history
    this.setData({
      history: []
    })

    //获取past中客户的数据
    await that.GetSublist("past", 1, this.data.PastNum)

    //waiting
    await that.GetSublist("waiting", 3, this.data.WaitingNum)

    //获取present中客户的数据
    await that.GetSublist("present", 2, this.data.PresentNum)
    that.setData({
      history: that.data.history.reverse()
    })
  },

  //获取信息数目
  async CheckNum() {
    //past
    var PastNum = await past.where({
      stuName: app.globalData.stuName
    }).count()
    PastNum = PastNum.total
    //waiting
    var WaitingNum = await waiting.where({
      stuName: app.globalData.stuName
    }).count()
    WaitingNum = WaitingNum.total
    //获取present中客户的数据
    var PresentNum = await present.where({
      stuName: app.globalData.stuName
    }).count()
    PresentNum = PresentNum.total
    //check
    //检测有无信息更新，如果有就刷新，并重新赋值
    if (this.data.PastNum != PastNum || this.data.PresentNum != PresentNum || this.data.WaitingNum != WaitingNum) {
      this.setData({
        CheckNum: true,
        PastNum: PastNum,
        PresentNum: PresentNum,
        WaitingNum: WaitingNum
      })
    } else {
      this.setData({
        CheckNum: false,
      })
    }
  },

  //使用完成
  EndUse(e) {
    app.ChangeTarget(e)
    this.window_complete(e)
  },

  //取消预约
  EndWait(e) {
    app.ChangeTarget(e)
    this.window_wait(e)
  },

  //用户取消预约窗口
  window_wait(e) {
    let that = this
    wx.showModal({
      title: "取消预约",
      content: "您已预约此设备，\r\n是否取消预约？",
      success: function (res) {
        if (res.confirm) {
          //取消预约
          that.deletewait(app.globalData.selectedEqu)
          //成功提醒
          wx.showToast({
            title: '取消成功',
          })
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },

  //用户确认设备使用完成弹窗
  window_complete(e) {
    wx.showModal({
      title: "使用完成",
      content: "您正在使用此设备，\r\n是否确认使用完成？",
      success: function (res) {
        if (res.confirm) {
          //强制结束-输入：需要结束的设备名称，需要改变成什么状态，结束时间
          app.EndUse(app.globalData.selectedEqu, 1, myDate.toLocaleString())
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },

  //删除预约消息
  async deletewait(EquName) {
    let info = await waiting.where({
      name: EquName
    }).get({})
    //可能出错
    let id = info.data[0]._id
    console.log(info.data)
    await waiting.doc(id).remove({})
    this.onShow()
  },

  // 更换选中目标
  ChangeTarget(e) {
    return new Promise((resolve, reject) => {
      equipment.where({
        name: e.detail[0]
      }).get().
      then(res => {
        var list = res.data[0]
        app.globalData.selectedEqu = list.name
        app.globalData.selectedEquID = list._id
        app.globalData.selectedEquClass = list.equipment_class
        resolve()
      })
    })
  },
  //合并数据 前一个为原本的数据，后一个为需要合并的数据
  CombineList(N, n) {
    return new Promise((resolve, reject) => {
      var length = N.length
      for (var index1 in n) {
        var index2 = Number(index1) + Number(length)
        N[index2] = n[index1]
      }
      resolve(N)
    })
  },

  //获取数组数据  数据库列表名称 state 数据个数 目前个数
  async GetSublist(list, state, Num) {
    var that = this
    var history1 = []
    const List = wx.cloud.database().collection(list)
    for (let i = 0; i < Num; i += 20) {
      history1 = await List.where({
        stuName: app.globalData.stuName
      }).skip(i).get()
      history1 = history1.data
      //将state录入history1中
      for (var index in history1) {
        history1[index].state = state
      }
      var sumList = await that.CombineList(that.data.history, history1)
      that.setData({
        history: sumList
      })
    }
  }
})