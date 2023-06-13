const app=getApp();
const db = wx.cloud.database().collection("past")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        signed:false,
        per3d:false,
        per3d9:false,
        perlaser:false,
        permill:false,
        percnc:false,
        pertools:false,
        perangle:false,
        listData:null,
        yes: "../../icon/checked.png",
        no:"../../icon/cross.png"
    },
    onLoad: function (options) {
        this.setData({
            signed:app.globalData.signed,
            per3d:app.globalData.per3d,
            per3d9:app.globalData.per3d9,
            perlaser:app.globalData.perlaser,
            percnc:app.globalData.percnc,
            permill:app.globalData.permill,
            pertools:app.globalData.pertools,
            perangle:app.globalData.perangle
        })
        let list=[
          {equ:"1-8号3d打印机",per:this.data.per3d},
          {equ:"9号3d打印机",per:this.data.per3d9},
          {equ:"激光切割机",per:this.data.perlaser},
          {equ:"数控雕刻机",per:this.data.percnc},
          {equ:"铣床",per:this.data.permill},
          {equ:"电动工具（除角磨机）",per:this.data.pertools},
          {equ:"角磨机",per:this.data.perangle},
        ]
        this.setData({
          listData:list
        })

    }
})