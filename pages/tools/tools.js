const devicesid =''//你的设备id 
const datastreams = ''//你的数据流ID 可以多个
const apikey = ''//你的apikey
var a
Page({
  data:{
    buttonMode: false,//false状态意味着未开启监听，true则意味着开启监听
    error: 3 //1代表运行中，2代表故障，3代表空闲
  },
  Button0(){
    this.setData({
      buttonMode:true
    })
    var that = this
    a = setInterval(function () { 
      wx.request({
        url: `https://api.heclouds.com/devices/${devicesid}/datastreams?datastream_ids=${datastreams}`,
        header: {
              "api-key": `${apikey}`,
            },
        success(res){
          console.log(res.data.data[0].current_value);//请求成功返回数据
          that.setData({
            error: res.data.data[0].current_value
          })
        },
        fail(){//请求失败
          wx.showToast({
            title: '与服务器通信失败',
            icon: 'fail',
            duration: 2000
          })
        }
      })
      if(!that.data.buttonMode)
      { 
        clearInterval(a) 
      } 
}, 2000) //循环时间
  },
  Button1(){
    this.setData({
      buttonMode:false
    })
  }
})