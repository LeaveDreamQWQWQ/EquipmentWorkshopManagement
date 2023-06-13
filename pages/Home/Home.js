// pages/demo1/demo1.js
var app = getApp()
var myDate = new Date();
//获取全局数据，确定在设备页面选中的设备
const db = wx.cloud.database({})
const equipment = db.collection('equipment')
const present = db.collection("present")
const user = db.collection("user")
Page({
  data: {
    //这个数据是页内用来切换列表的，不用管
    //这个list是上面两个大图标的list，这个可以不用放到数据库里
    tabs: [{
        id: 0,
        name: "3D printer",
        isActive: true,
        icon: "https://cdn0.iconfinder.com/data/icons/3d-printing-solid-1/48/3d_printer_printing-512.png"
      },
      {
        id: 1,
        name: "more equipment",
        isActive: false,
        icon: "https://cdn4.iconfinder.com/data/icons/electric-work-tools/76/Angle_grinder-512.png"
      }
    ],
    //打印机列表
    subtab_3Dprinter: [],
    //除打印机外其他设备的list
    other_equipment: [],
    //当前用户正在使用设备列表
    Using: [],
    //设备工坊是否开放
    TimeLimit: false,
    //管理员权限
    power: null,
    //故障弹窗
    ShowWindow: false,
    //当前时间
    NowTime: null
  },

  onShow() {
    this.initialize()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow()
  },

  //这个方法是用来在页面内切换列表的
  HandleItemChange(e) {
    let tabs = this.data.tabs;
    tabs.forEach((v, i) => i === e.detail ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs: tabs
    })
  },


  //在这个页面展示的时候就要获取一次设备的数据，将设备数据赋值给data里的subtab_3Dprinter列表（目前只做了一个列表，所以只赋值给了subtab_3Dprinter列表）
  // 以后会做两个，一个是打印机的，另一个是其他设备的
  //初始化（调取各种数据）
  async initialize(e) {
    const equipment = wx.cloud.database().collection('equipment')
    console.log(equipment)
    let that = this
    app.globalData.book = false
    app.globalData.force = false
    await wx.cloud.callFunction({
      name: "autoFinish"
    })
    await wx.cloud.callFunction({
      name: "autoStart"
    })
    // console.log("正在使用的设备：",re.result.namelist)
    //获取打印机数据
    let res = await equipment.where({
      equipment_class: '3DPrinter'
    }).get({})
    console.log(res)
    that.setData({
      subtab_3Dprinter: res.data
    })
    //获取其他设备数据
    res = await equipment.where({
      equipment_class: 'Other Equipment'
    }).get()
    that.setData({
      other_equipment: res.data
    })
    //改变该用户使用设备的设备状态
    this.Using(e)

    //设备工坊是否开放
    if (myDate.getHours() + myDate.getMinutes() / 60 >= 8.5 && myDate.getHours() + myDate.getMinutes() / 60 <= 18.5) {
      this.setData({
        TimeLimit: true
      })
    } else {
      this.setData({
        TimeLimit: true
      })
    }
    //管理员权限
    this.setData({
      power: app.globalData.power
    })
    //目前时间
    var util = require('../../utils/util')
    this.setData({
      NowTime: util.formatTime(myDate)
    })
  },

  //改变该用户使用设备的设备状态
  async Using(e) {
    //获取当前用户正在使用的设备
    let using = await present.where({
      stuid: app.globalData.stuid
    }).get({})
    this.setData({
      Using: using.data
    })
    //修改当前用户正在使用设备状态
    for (let index1 = 0; index1 < this.data.Using.length; index1++) {
      //打印机
      let list = this.data.subtab_3Dprinter
      for (let index2 = 0; index2 < list.length; index2++) {
        if (list[index2].name == this.data.Using[index1].name) {
          list[index2].state = 4
        }
      }
      this.setData({
        subtab_3Dprinter: list
      })
      //其他设备
      list = this.data.other_equipment
      for (let index2 = 0; index2 < list.length; index2++) {
        if (list[index2].name == this.data.Using[index1].name) {
          list[index2].state = 4
        }
      }
      this.setData({
        other_equipment: list
      })
    }

  },

  //这个方法用于跳转到飞飞的登记页面
  pagechange(e) {
    wx.navigateTo({
      url: '../register/register'
    })

  },

  //设备工坊使用时间弹窗
  TimeLimit(e) {
    wx.showModal({
      title: "设备工坊未开放",
      content: "设备工坊开放时间为\n8:30到17:30\n请在开放时间进行设备使用",
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../Home/Home.js',
          })
        } else {
          wx.switchTab({
            url: '../Home/Home.js',
          })
        }
      }
    })

  },

  //没有准入权限、没有注册弹窗
  disregister(e) {
    wx.showModal({
      title: "注册",
      content: "您还没有注册，\r\n是否前往注册页面？",
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../user/user',
          })
        } else {
          wx.switchTab({
            url: '../Home/Home',
          })
        }
      }
    })
  },

  //没有使用某设备的权限弹窗
  permisionless(e) {
    wx.showModal({
      title: "设备权限",
      content: "您还没有该设备的权限，\r\n请接受培训之后再登记使用",
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../Home/Home',
          })
        } else {
          wx.switchTab({
            url: '../Home/Home',
          })
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
          app.EndUse(app.globalData.selectedEqu, 1)
        } else {
          console.log("用户点击了取消")
        }
      }
    })
  },

  //如果是管理员，给予从故障到空闲的恢复权限
  ReFalse(e) {
    app.ChangeTarget(e).then(res => {
      console.log("恢复恢复")
      if (app.globalData.power) {
        wx.showModal({
          title: "设备已正常",
          content: "您确定改变设备状态\n为正常状态么？",
          success: function (res) {
            if (res.confirm) {
              equipment.doc(app.globalData.selectedEquID).update({
                data: {
                  state: 1
                },
                success: function (res) {
                  console.log("设备已恢复正常使用")
                  //刷新页面
                  const pages = getCurrentPages()
                  const perpage = pages[pages.length - 1]
                  perpage.onShow()
                  //提示设备恢复正常使用
                  wx.showToast({
                    title: '已恢复',
                    duration: 2000, //停留时间
                  })
                }
              })
            } else {
              console.log("用户点击了取消")
            }
          }
        })
      }
    })


  },

  // 修改正在使用设备状态为故障——故障报告
  // 如果设备非空闲，还需要上传结束时间（保障流程完整）
  async SetFalse(e) {
    // 记录故障
    // 发送邮件 
    if (e.detail[0] != []) {
      let target = await user.doc("PowerEmail").get({})
      target = target.data.PowerEmail
      wx.cloud.callFunction({
        name: "sendEmail",
        data: {
          // target: app.globalData.PowerEmail,
          target: target,
          // target: "12010411@mail.sustech.edu.cn",
          authcode: "设备名称：" + app.globalData.selectedEqu + "\n\n故障内容：" + e.detail[0] + "\n\n\n报告人：" + app.globalData.stuName + "\n报告人学号：" + app.globalData.stuid,
          subject: "故障设备报告"
        }
      }).then(res => {
        // 邮件发送成功后执行的代码
        console.log("发送成功")
      }).catch(err => {
        // 邮件发送失败后执行的代码
        console.log("发送失败")
      })
      //结束当前使用状态
      await app.EndUse(app.globalData.selectedEqu, 3)
      //隐藏弹窗
      this.HideWindow(e)
      //提示报告成功
      wx.showToast({
        title: '故障报告成功',
        duration: 2000, //停留时间
      })
    } else {
      //隐藏弹窗
      this.HideWindow(e)
      //提示报告成功
      wx.showToast({
        title: '内容不能为空',
        duration: 2000, //停留时间
      })
    }

  },

  //故障弹窗展现
  ShowWindow(e) {
    //用户未注册
    if (!app.globalData.signed) {
      wx.showToast({
        title: '请先注册',
        icon: 'error'
      })
    } else {
      app.ChangeTarget(e).then(res => {
        this.setData({
          ShowWindow: true
        })
      })
    }
  },

  //故障弹窗隐藏
  HideWindow(e) {
    this.setData({
      ShowWindow: false
    })
  },

  //防止窗口弹出后页面还能滑动
  preventTouchMove: function () {},

  //用户点击空闲设备
  isAvailable(e) {
    let that = this
    that.judge(e).then(permission => {
      if (permission) {
        that.window_choose(e, true).then(book => {
          if (book) {
            app.globalData.book = true
            that.pagechange()
          } else if (!book) {
            that.pagechange()
          }
        })
      } else {
        that.permisionless(e)
      }
    })
  },

  //用户点击非空闲设备
  disAvailable(e) {
    return new Promise((resolve, reject) => {
      let that = this
      const permission = that.judge(e)
      if (permission) {
        //选中设备正在使用者的openid
        var EquOpenid = null
        app.ChangeTarget(e).then(res => {
          //获取选中设备正在使用者的openid
          present.where({
            name: app.globalData.selectedEqu
          }).get().then(res => {
            EquOpenid = res.data[0]._openid
            // 这里需要获取用户信息和设备使用者信息进行核对
            // 如果为不同人，执行以下操作
            if (app.globalData.openid != EquOpenid) {
              that.window_choose(e, false).then(book => {
                if (book) {
                  app.globalData.book = true
                  that.pagechange()
                } else if (!book) {
                  wx.showModal({
                    title: "警告！",
                    content: "设备正在被其他人使用中，\r\n是否确定使用该设备么？",
                    success: res => {
                      if (res.confirm) {
                        app.globalData.force = true
                        that.pagechange()
                      } else {
                        console.log("用户点击了取消")
                      }
                    }
                  })
                }
              })
            } else {
              //同一个人执行这个
              that.window_complete(e)
            }
          })
        }).then(res => {
          resolve()
        })
      } else {
        that.permisionless(e)
        resolve()
      }

    })
  },

  //进行一系列判断：是否注册？是否开放？是否有权限？==>返回布尔值：是否有权限？
  judge(e) {
    return new Promise((resolve, reject) => {
      let that = this
      app.ChangeTarget(e).then(res => {
        //用户未注册
        if (!app.globalData.signed) {
          that.disregister(e)
        }
        //判断工坊是否开放
        else if (!that.data.TimeLimit) {
          that.TimeLimit()
        }
        // 判断是否有设备权限
        else {
          //打印机
          if (app.globalData.selectedEquClass == "3DPrinter") {
            //一到八号打印机
            if (app.globalData.selectedEquID != "3d9") {
              if (app.globalData.per3d) {
                resolve(true)
              } else {
                resolve(false)
              }
            }
            //9号打印机
            else {
              if (app.globalData.per3d9) {
                resolve(true)
              } else {
                resolve(false)
              }
            }

          }
          //激光切割
          else if (app.globalData.selectedEquID == "laser" && app.globalData.perlaser) {
            resolve(true)
          }
          //铣床
          else if (app.globalData.selectedEquID == "mill" && app.globalData.permill) {
            resolve(true)
          }
          //数控cnc
          else if (app.globalData.selectedEquID == "cnc" && app.globalData.percnc) {
            resolve(true)
          }
          //电动工具(除角磨机)
          else if ((app.globalData.selectedEquID == "mitre saw" || app.globalData.selectedEquID == "bench saw" || app.globalData.selectedEquID == "Sand table belt machine") && app.globalData.pertools) {
            resolve(true)
          }
          //角磨机
          else if (app.globalData.selectedEquID == "grinder" && app.globalData.perangle) {
            resolve(true)
          }
          //给管理员开放全部权限
          else if (app.globalData.power) {
            resolve(true)
          }
          //没有设备权限弹窗
          else {
            resolve(false)
          }
        }
      })
    })
  },

  //用户选择现在使用 or 预约
  //现在使用：如果设备非空闲，force=true
  window_choose() {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: ['现在使用', '预约'],
        success: res => {
          switch (res.tapIndex) {
            case 0:
              resolve(false)
              break
            case 1:
              resolve(true)
              break
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    })
  }

})