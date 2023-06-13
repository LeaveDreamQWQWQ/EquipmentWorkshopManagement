// components/window/window.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        ShowWindow: {
            type: Boolean,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value : null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        HideWindow(e) {
            this.triggerEvent("HideWindow")
        },
        preventTouchMove: function () {},

         SetFalse(e) {
             if(this.data.value==null){
                 wx.showToast({
                   title: '故障内容不能为空！',
                   icon:'error',
                   mask:'true',
                   duration:1000
                 })
             }
             else{
                this.triggerEvent("SetFalse", [this.data.value])
             }
        },

        GetInput(e) {
            this.setData({
                value:e.detail.value
            })
        }
    }
})