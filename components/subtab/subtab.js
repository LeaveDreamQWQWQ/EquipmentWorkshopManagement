// components/subtab/subtab.js
var app = getApp();
var myDate = new Date();
Component({
    /**
     * 组件的属性列表
     */
    // 继承父页传下来的数据
    properties: {
        subtab: {
            type: Array,
            value: []
        },
        register: {
            type: Boolean,
            value: null
        },
        power: {
            type: Boolean,
            value: null
        },
        NowTime:{
            type:String,
            value:null
        }
    },
    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */


    methods: {
        //显示故障弹窗
        ShowWindow(e){
            this.triggerEvent("ShowWindow", [e.currentTarget.dataset.name])
        },

        //用户点击空闲设备时的方法
        isAvailable(e) {
            this.triggerEvent("isAvailable", [e.currentTarget.dataset.name])
        },

        //如果有人点击了非空闲设备的方法
        disAvailable(e) {
            this.triggerEvent("disAvailable", [e.currentTarget.dataset.name])
        },

        //管理员恢复故障设备正常使用
        ReFalse(e) {
            this.triggerEvent("ReFalse", [e.currentTarget.dataset.name])
        },


        // 点击故障报告按钮——需要修改设备状态到故障。
        // 如果设备非空闲，还需要上传结束时间（保障流程完整）
        SetFalse(e) {
            console.log(this.data.power)
            this.triggerEvent("SetFalse", [e.currentTarget.dataset.name])
        },
        //用户点击故障设备提醒
        ShowFalse(e){
          console.log(e)
          wx.showToast({
            title: '设备已故障',
            icon:'error'
          })
        }
    }
})