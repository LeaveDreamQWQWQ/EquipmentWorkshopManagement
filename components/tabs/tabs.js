// components/tabs/tabs.js
Component({
    /**
     * 组件的属性列表
     */
    //继承父页传进来的数据
    properties: {
        tabs: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */

    //继承父页传进来的方法
    methods: {
        handletap(e) {
            this.triggerEvent("itemchange", e.currentTarget.dataset.index)
        }

    }
})